"use client";
import { useRouter } from "next/navigation";

import {
  addDeviceFunctionClientData,
  cleanDeviceFunctionClientData,
  deleteDeviceFunctionClientData,
  updateDeviceFunctionClientData,
} from "lib/features/deviceFunctionClientData/deviceFunctionClientDataSlice";

import { useAppDispatch, useAppSelector } from "lib/hooks";

import { formatUrl } from "utils/urlUtils";

import { useState } from "react";

import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import {
  formSchemaType,
  type deviceFunctionFormType,
} from "types/deviceFunctionClientData";

import DeviceFormManager from "components/dashboard/admin/deviceFunctionForm/DeviceFormManager";
import { generateUUID } from "utils/uuidUtils";

export default function NewDevice() {
  const router = useRouter();

  const createNewDevice = useMutation(api.device.createDevice);
  const createNewFunction = useMutation(api.deviceFunction.createFunction);

  const dispatch = useAppDispatch();

  const currentTeam = useAppSelector(
    (state) => state.databaseData.userActiveTeamInfo,
  );
  const [isCreating, setIsCreating] = useState(false);

  const currentFunctions = useAppSelector(
    (state) => state.deviceFunctionClientData,
  );

  function functionSubmitHandler(data: deviceFunctionFormType) {
    if (data.id === "") {
      data.id = generateUUID();
      dispatch(addDeviceFunctionClientData(data));
    } else {
      dispatch(updateDeviceFunctionClientData(data));
    }
    setIsCreating(false);
  }

  async function submitHandler(data: formSchemaType) {
    const deviceId = await createNewDevice({
      name: data.deviceName,
      description: data.deviceDescription,
      teamId: currentTeam._id,
    });

    currentFunctions.forEach((functionData) => {
      const scaleData = functionData.scaleData.map((data) => {
        return data.value;
      });
      createNewFunction({
        deviceId: deviceId,
        name: functionData.name,
        description: functionData.description,
        command: functionData.command as string,
        typeOfFunction: functionData.typeOfFunction,
        blocking: false,
        userInfo: functionData.userInfo,
        userTypeOfEntry: functionData.userTypeOfEntry,
        unit: functionData.unit,
        symbol: "",
        format: functionData.format,
        maxInterval: functionData.maxInterval,
        minInterval: functionData.minInterval,
        scaleData: scaleData,
        message: functionData.message,
        sendData: functionData.sendData,
        streaming: false,
      });
    });

    dispatch(cleanDeviceFunctionClientData());
    const url = formatUrl(data.deviceName, deviceId);
    router.replace(`/admin/devices/${url}`);
  }

  function functionDeleteHandler(id: string) {
    dispatch(deleteDeviceFunctionClientData(id));
    setIsCreating(false);
  }

  function deviceCancelHandler() {
    router.replace("/admin");
    dispatch(cleanDeviceFunctionClientData());
  }

  const deviceInitialState: formSchemaType = {
    deviceName: "",
    deviceDescription: "",
  };
  return (
    <section className="h-full overflow-y-scroll px-4 pb-40">
      <DeviceFormManager
        submitHandler={submitHandler}
        functionData={currentFunctions}
        functionSubmitHandler={functionSubmitHandler}
        setIsCreating={setIsCreating}
        isCreating={isCreating}
        functionDeleteHandler={functionDeleteHandler}
        cancelHandler={deviceCancelHandler}
        deviceInitialState={deviceInitialState}
        deviceDeleteHandler={undefined}
      />
    </section>
  );
}
