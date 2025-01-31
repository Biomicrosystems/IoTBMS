"use client";
import Skeleton from "components/dashboard/Skeleton";

import { writeToPort } from "utils/serialUtils";

import { updateFileQueue } from "lib/features/fileQueue/fileQueueSlice";
import { useAppDispatch, useAppSelector } from "lib/hooks";

import { useEffect } from "react";

import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { posibleStatus } from "types/serial";
import { useToast } from "components/primitives/useToast";
import { removeUnexpectedDisconnect } from "lib/features/unexpectedDisconnect/unexpectedDisconnectSlice";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const dataToSend = useAppSelector((state) => state.fileEnqueu);
  const deviceConected = useAppSelector((state) => state.conectedDevice);
  const conectedDeviceIds = deviceConected.map(
    (data) => data.id as Id<"device">,
  );

  const unexpectedDisconections = useAppSelector(
    (state) => state.unexpectedDisconnect,
  );
  const currentTeam = useAppSelector(
    (state) => state.databaseData.userActiveTeam,
  );

  const devices = useQuery(api.device.getdevices, { teamId: currentTeam });

  const pendingCommands = useQuery(api.command.getPendingCommandsByDeviceId, {
    deviceId: conectedDeviceIds,
  });

  const commands = useQuery(api.command.getCommandsByDeviceId, {
    deviceId: conectedDeviceIds,
  });

  const getFileUrl = useMutation(api.device.generateUploadUrl);
  const writeFileToDb = useMutation(api.device.sendFileIdentifier);
  const updateCommandStatus = useMutation(api.command.updateCommandStatus);
  const setDeviceActive = useMutation(api.device.setDeviceActive);

  useEffect(() => {
    if (unexpectedDisconections.length > 0) {
      unexpectedDisconections.forEach((device) => {
        const deviceFound = devices?.find(
          (data) => device.id === (data._id as string),
        );
        if (deviceFound) {
          toast({
            variant: "destructive",
            title: "Dispositivo Desconectado",
            description: `Se ha perdido la comunicación con el dispositivo "${deviceFound.name}."`,
          });
          dispatch(removeUnexpectedDisconnect(device.id));
        }
      });
    }
  }, [unexpectedDisconections]);

  useEffect(() => {
    if (!devices) {
      return;
    }
    const filteredDevices = devices.filter((device) =>
      conectedDeviceIds.includes(device._id),
    );
    filteredDevices.forEach((device) => {
      if (device.isOnline.isOnline) {
        return;
      } else {
        setDeviceActive({ deviceId: device._id });
      }
    });
  }, [devices, conectedDeviceIds]);

  useEffect(() => {
    if (!("serial" in navigator)) {
      return;
    }
    if (!pendingCommands || deviceConected.length <= 0) {
      return;
    }
    if (pendingCommands.length <= 0) {
      return;
    }

    pendingCommands.forEach((command) => {
      if (!command) {
        return;
      }

      const targetDevice = deviceConected.find(
        (device) => device.id === command.functionData?.deviceId,
      );

      const formattedCommand = `${command.functionData?.command}${command.payload}`;

      writeToPort(targetDevice?.device, formattedCommand);

      if (command.functionData?.sendData) {
        updateCommandStatus({
          commandId: command.commandId,
          status: posibleStatus.INPROCESS,
        });
      } else {
        updateCommandStatus({
          commandId: command.commandId,
          status: posibleStatus.FINISHED,
        });
        writeFileToDb({ deviceId: targetDevice?.id as Id<"device"> });
      }
    });
  });

  useEffect(() => {
    dataToSend.forEach((data) => {
      if (!commands) {
        return;
      }
      if (commands.length <= 0) {
        dispatch(updateFileQueue(data.id));
        return;
      }
      const commandInProcess = commands.filter(
        (command) => command.status === posibleStatus.INPROCESS,
      );
      commandInProcess.forEach(async (command) => {
        const url = await getFileUrl();
        const result = await fetch(url, {
          method: "POST",
          body: data.file,
        });
        const { storageId } = await result.json();

        await writeFileToDb({
          storageId: storageId,
          deviceId: data.deviceId as Id<"device">,
        });
        updateCommandStatus({
          commandId: command.commandId,
          status: posibleStatus.FINISHED,
        });
      });
      dispatch(updateFileQueue(data.id));
    });
  }, [dataToSend]);
  return <Skeleton isAdmin={true}>{children}</Skeleton>;
}
