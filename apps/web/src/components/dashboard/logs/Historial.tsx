"use client";
import { DownloadIcon } from "@radix-ui/react-icons";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchAndReadStreamData,
  filterAndFormatData,
  getCardsData,
  getDownloadData,
  getGraphData,
} from "utils/FileProcessingUtils";
import { deFormatUrl } from "utils/urlUtils";
import DeviceGraph from "../device/DeviceGraph";
const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric", // Full year
  month: "long", // Full month name
  day: "numeric", // Day of the month
  hour: "numeric", // Hour
  minute: "numeric", // Minute
  second: "numeric", // Second
};
export default function Historial() {
  const params = useParams<{ deviceName: string }>();
  const deviceId = deFormatUrl(params.deviceName);

  const device = useQuery(api.device.getdeviceById, {
    deviceId: deviceId as Id<"device">,
  });

  const commands = useQuery(api.command.getCommandsByDeviceId, {
    deviceId: [deviceId as Id<"device">],
  });

  const getFileUrl = useMutation(api.device.getFiles);

  const initialState =
    (commands?.length as number) > 0
      ? commands
        ? commands[0].commandId.toString()
        : undefined
      : undefined;

  const [currentCommand, setCurrentCommand] = useState("");
  const [currentFileState, setCurrentFileState] = useState<string | null>("");
  const [recievedData, setRecievedData] = useState("");

  if (initialState) {
    if (currentCommand === "") {
      setCurrentCommand(initialState);
    }
  }

  const commandSelectors = commands?.map((commandData) => {
    return (
      <option
        key={commandData.commandId}
        value={commandData.commandId}
        className="bg-white dark:bg-dark "
      >
        {commandData.functionData?.name}
      </option>
    );
  });

  const currentCommandData = commands?.find(
    (command) => command.commandId.toString() === currentCommand,
  );

  let currentDate = "";
  if (currentCommandData) {
    const rawDate = new Date(currentCommandData.creationTime);
    currentDate = new Intl.DateTimeFormat("es-ES", dateOptions).format(rawDate);
  }

  const currentCommandIndex = commands?.findIndex(
    (command) => command.commandId.toString() === currentCommand,
  );
  let currentFile: Id<"_storage"> | null = null;

  if (currentCommandIndex) {
    const sortedFiles = device?.files.slice().reverse();
    if (sortedFiles) {
      currentFile = sortedFiles[currentCommandIndex];
    }
  }

  useEffect(() => {
    setCurrentFileState(currentFile);
  }, [currentFile]);

  useEffect(() => {
    if (currentFileState) {
      const getFunction = async () => {
        const fileUrl = await getFileUrl({
          storageId: currentFileState as Id<"_storage">,
        });
        if (!fileUrl) {
          return;
        }
        const data = await fetchAndReadStreamData(fileUrl);
        setRecievedData(data);
      };
      getFunction();
    }
  }, [currentFileState]);

  if (!device) {
    return;
  }

  const filteredData = filterAndFormatData(recievedData);
  const consoleData = filteredData?.map((value, index) => {
    return <li key={index}>{value}</li>;
  });
  const graphData = getGraphData(filteredData);
  const cardData = getCardsData(filteredData);

  return (
    <section className="h-full overflow-y-scroll px-4 pb-40">
      <h2 className="my-0 mb-2 border-none bg-transparent px-0 font-semibold outline-none focus:ring-0 lg:text-4xl">
        {device.name}
      </h2>
      <p
        className={`mb-4 border-0 bg-transparent px-0 text-sm  text-lightText outline-none lg:text-base dark:text-darkText`}
      >
        {device.description}
      </p>

      <h3 className="mb-2  text-xl font-medium lg:text-2xl">
        Ultimas funciones
      </h3>
      <p
        className={`mb-4 border-0 bg-transparent px-0 text-sm  text-lightText outline-none lg:text-base dark:text-darkText`}
      >
        Ultimas funciones ejecuciones en el dispositivo
      </p>
      <div className="mb-2 flex flex-col  gap-4 lg:flex-row">
        {(commands?.length as number) > 0 ? (
          <>
            <div>
              <p
                className={`border-0 bg-transparent px-0 text-sm  italic text-lightText outline-none lg:text-base dark:text-darkText`}
              >
                Fecha de ejecucion: {currentDate}
              </p>
            </div>
            {currentFileState ? (
              <button
                className="flex h-11 items-center justify-center gap-2 rounded bg-accent p-2 text-white"
                onClick={() => {
                  const downloadData = getDownloadData(recievedData);
                  const csvBlob = new Blob([downloadData], {
                    type: "text/csv;charset=utf-8",
                  });
                  const url = window.URL.createObjectURL(csvBlob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${deviceId}.csv`;

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  window.URL.revokeObjectURL(url);
                }}
              >
                Descargar Datos <DownloadIcon className="size-5" />
              </button>
            ) : (
              <></>
            )}
          </>
        ) : (
          <p className="mb-2 border border-black p-2 text-sm font-bold dark:border-white">
            Esta function no tiene comandos ejecutados
          </p>
        )}
      </div>
      {currentCommandData?.functionData?.sendData ? (
        <>
          <h3 className="text-xl  font-medium lg:text-2xl">Datos Recibidos</h3>
          <h4 className="mb-2 text-sm lg:text-xl">Consola de comandos</h4>
          <p className="mb-2 text-xs text-lightText lg:text-base dark:text-darkText">
            Esta sección muestra todos los datos recibidos que no se
            configuraron para graficar
          </p>
          <div className="dark:border-darkTex relative mb-4 max-h-32 min-h-20 w-full overflow-y-scroll rounded border border-lightText p-2 text-sm">
            <ul>{consoleData}</ul>
          </div>
          <h4 className="mb-2 text-sm lg:text-xl">Últimos datos recibidos</h4>
          <p className="mb-2 text-xs text-lightText lg:text-base dark:text-darkText">
            Esta sección muestra los datos configurados como “mostrar ultimo”
          </p>
          <div className="mb-4 flex h-auto items-start justify-start gap-4 overflow-x-scroll p-2"></div>
          <h4 className="mb-2 text-sm lg:text-xl">Graficas</h4>
          <p className="mb-2 text-xs text-lightText lg:text-base dark:text-darkText">
            Esta sección muestra los datos configurados como “Graficar”{" "}
          </p>
          <DeviceGraph graphData={graphData} />
        </>
      ) : (
        <></>
      )}
    </section>
  );
}
