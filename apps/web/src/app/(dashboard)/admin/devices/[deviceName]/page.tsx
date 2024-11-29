"use client";

import { useParams } from "next/navigation";

import FunctionCard from "components/dashboard/admin/device/FunctionCard";

import {
  closePort,
  connectToSerial,
  getReader,
  startReading,
} from "utils/serialUtils";
import { deFormatUrl } from "utils/urlUtils";

import { useAppDispatch, useAppSelector } from "lib/hooks";
import {
  addConectedDevice,
  removeConectedDevice,
} from "lib/features/conectedDevices/conectedDevicesSlice";
import { cleanRawSerialData } from "lib/features/rawSerialData/rawSerialDataSlice";

import { useEffect, useState } from "react";

import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import type { conectedDeviceData } from "types/serial";
import EditView from "components/dashboard/admin/device/EditView";
import {
  ejex,
  filterAndFormatData,
  generarListaNumeros,
  getCardsData,
  getGraphData,
} from "utils/FileProcessingUtils";
import GraphComponent from "components/primitives/Chart";
import DeviceGraph from "components/dashboard/device/DeviceGraph";
import { useToast } from "components/primitives/useToast";
import { CheckIcon, GearIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/primitives/Popover";

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "components/primitives/Command";

export default function Device() {
  const { toast } = useToast();
  const baudRateData = [
    300, 600, 750, 1200, 2400, 4800, 9600, 19200, 31250, 38400, 57600, 74880,
    115200, 230400, 250000, 460800, 500000, 921600, 1000000, 2000000,
  ];
  //Set state Functions
  const dispatch = useAppDispatch();
  const setDeviceInactive = useMutation(api.device.setDeviceInactive);

  const params = useParams<{ deviceName: string }>();
  const deviceId = deFormatUrl(params.deviceName);

  //Get state Functions
  const [isEditing, setIsEditing] = useState(false);
  const [baudRate, setBaudRate] = useState(9600);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<SerialPort | undefined>(
    undefined,
  );
  const [reader, setReader] = useState<ReadableStreamDefaultReader | undefined>(
    undefined,
  );

  const rawSerialData = useAppSelector((state) => state.rawSerialData);
  const devicesList = useAppSelector((state) => state.conectedDevice);

  const device = useQuery(api.device.getdeviceById, {
    deviceId: deviceId as Id<"device">,
  });
  const functions = useQuery(api.deviceFunction.getFunctionByDeviceId, {
    deviceId: deviceId as Id<"device">,
  });

  // Variable Data - recalculated each re render

  const textSerialData = rawSerialData.map((data) => data.data);
  const formattedData = filterAndFormatData(textSerialData.join(""));

  const graphData = getGraphData(formattedData);
  const cardData = getCardsData(formattedData);

  // Effects

  useEffect(() => {
    const isConected = devicesList.find((item) => item.id === deviceId);
    if (selectedPort === undefined) {
      if (isConected) {
        setSelectedPort(isConected.device);
        setReader(isConected.reader);
      }
    } else {
      if (!isConected) {
        setSelectedPort(undefined);
        setReader(undefined);
      }
    }
  }, [devicesList]);
  useEffect(() => {
    if (selectedPort !== undefined) {
      const data: conectedDeviceData = {
        id: deviceId,
        device: selectedPort,
        reader: reader as ReadableStreamDefaultReader,
      };
      dispatch(addConectedDevice(data));
    } else {
      dispatch(cleanRawSerialData(deviceId));
    }
  }, [selectedPort]);

  // Component Render
  const serialDataCard = formattedData.map((data, index) => {
    return <ul key={index}>{data}</ul>;
  });
  const cardDataComponent = cardData?.map((value, index) => {});
  const functionscom = functions?.map((e, i) => {
    return <FunctionCard functionData={e} key={i} serialPort={selectedPort} />;
  });

  const array = [
    -100, 1000, -30, 500, -29.8, 150, 300, 1000, 200, 500, 600, 150,
  ];
  const ejexData = ejex(array);

  return (
    <section className="h-full overflow-y-scroll px-4 pb-40">
      {isEditing ? (
        <EditView
          deviceId={deviceId}
          name={device?.name as string}
          description={device?.description as string}
          deviceFunctions={functions}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
          <h2 className="my-0 mb-2 border-none bg-transparent px-0 font-semibold outline-none focus:ring-0 lg:text-4xl">
            {device?.name}
          </h2>
          <p
            className={`mb-4 border-0 bg-transparent px-0 text-sm  text-lightText outline-none lg:text-base dark:text-darkText`}
          >
            {device?.description}
          </p>

          <h3 className="mb-2 text-xl font-medium lg:text-2xl">
            Funciones Disponibles
          </h3>

          <div className="mb-8 flex w-full auto-rows-max grid-cols-2 flex-col justify-items-center gap-4 lg:grid 2xl:grid-cols-3">
            {functionscom}
          </div>
          <h4 className="text-sm lg:text-xl">Consola de comandos</h4>
          <p className="mb-4 text-xs italic text-lightText lg:text-sm dark:text-darkText">
            Datos recibidos del microcontrolador
          </p>

          <div className="dark:border-darkTex relative mb-4 max-h-32 min-h-20 w-full overflow-y-scroll rounded border border-lightText p-2 text-sm">
            <ul>{serialDataCard}</ul>
          </div>
          <h4 className="mb-2 text-sm lg:text-xl">Últimos datos recibidos</h4>
          <p className="mb-4 text-xs italic text-lightText lg:text-sm dark:text-darkText">
            Para ver datos en esta seccion envialos con el formato
            "&lt;variable:"
          </p>
          <div className="mb-4 flex h-auto w-full max-w-full items-start justify-start gap-4 overflow-x-scroll">
            {(cardDataComponent?.length as number) > 0 ? (
              <>{cardDataComponent}</>
            ) : (
              <p>No hay datos configurados para mostrar su ultimo valor</p>
            )}
          </div>
          <h4 className="mb-2 text-sm lg:text-xl">Graficas</h4>
          <p className=" text-xs italic text-lightText lg:text-sm dark:text-darkText ">
            Para ver datos en esta seccion envialos con el formato
            "&gt;variable:"
          </p>

          <DeviceGraph graphData={graphData} />

          <div className="fixed bottom-0 left-0 flex h-[4.4rem] w-full items-center justify-center gap-8 border-t border-t-lightText/60 bg-white drop-shadow lg:absolute lg:justify-end lg:px-12 dark:border-t-darkText dark:bg-dark">
            {!selectedPort && (
              <button
                className="rounded border border-lightText bg-transparent px-8 py-2 text-sm text-lightText transition hover:bg-gray-50 dark:border-darkText dark:text-darkText"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
            )}
            {"serial" in navigator && (
              <div className="flex items-center justify-center">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={`flex h-full items-center  justify-center rounded-l border-r border-r-indigo-400 bg-accent px-1 py-2 transition hover:bg-indigo-700 ${selectedPort ? "hidden" : ""}`}
                    >
                      <GearIcon className="size-5 text-white" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="h-80 w-48 bg-white  text-sm dark:bg-dark">
                    <Command
                      defaultValue={baudRate.toString()}
                      className="h-full"
                    >
                      <CommandInput placeholder="Tasa de baudios" />
                      <CommandEmpty>No se encontro</CommandEmpty>
                      <CommandList className="h-full">
                        {baudRateData.map((data, index) => {
                          return (
                            <CommandItem
                              value={data.toString()}
                              key={data}
                              onSelect={(value) => {
                                setPopoverOpen(false);
                                setBaudRate(Number(value));
                              }}
                              className="flex justify-between"
                            >
                              {data}
                              <CheckIcon
                                className={`${baudRate === data ? "opacity-100" : "opacity-0"}`}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <button
                  className={`rounded-r  px-8 py-2 text-sm text-white  transition ${!selectedPort ? "bg-accent hover:bg-indigo-700" : "bg-danger hover:bg-red-600"}`}
                  onClick={async () => {
                    if (!selectedPort) {
                      try {
                        const serialPort = await connectToSerial(
                          baudRate,
                          deviceId,
                        );
                        const reader = await getReader(serialPort);

                        setSelectedPort(serialPort);
                        setReader(reader);
                        startReading(serialPort, reader, deviceId);
                        toast({
                          description: "Dispositivo Conectado correctamente",
                          variant: "success",
                        });
                      } catch (e: any) {
                        toast({
                          title: "¡Algo Salio Mal!",
                          description: e.message,
                          variant: "destructive",
                        });
                      }
                    } else {
                      await closePort(selectedPort, reader);
                      dispatch(removeConectedDevice(deviceId));
                      setReader(undefined);
                      setSelectedPort(undefined);
                      setDeviceInactive({ deviceId: deviceId as Id<"device"> });
                      toast({
                        variant: "success",
                        description: "Dispositivo desconectado con éxito.",
                      });
                    }
                  }}
                >
                  {selectedPort ? "Desconectar" : "Conectar"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
