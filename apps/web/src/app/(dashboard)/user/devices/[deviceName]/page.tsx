"use client";
import { useParams } from "next/navigation";

import FunctionCardExecution from "components/dashboard/user/FunctionCardsExecution";

import {
  fetchAndReadStreamData,
  filterAndFormatData,
  getCardsData,
  getDownloadData,
  getGraphData,
} from "utils/FileProcessingUtils";
import { deFormatUrl } from "utils/urlUtils";

import { useEffect, useState } from "react";

import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import { Card, LineChart } from "@tremor/react";
import LastCheckedOnline from "components/dashboard/user/LastCheckedOnline";
import { ArrowDownTray } from "components/icons/ArrowDownTray";

export default function Device() {
  const [recievedData, setRecievedData] = useState("");
  const params = useParams<{ deviceName: string }>();
  const deviceId = deFormatUrl(params.deviceName);

  const device = useQuery(api.device.getdeviceById, {
    deviceId: deviceId as Id<"device">,
  });
  const functions = useQuery(api.deviceFunction.getFunctionByDeviceId, {
    deviceId: deviceId as Id<"device">,
  });

  const file = useQuery(api.device.getStorageUrl, {
    deviceId: deviceId as Id<"device">,
  });

  const getFileUrl = useMutation(api.device.getFiles);
  const functionscom = functions?.map((e, i) => {
    return <FunctionCardExecution functionData={e} key={i} />;
  });

  useEffect(() => {
    if (file) {
      if (file[2]) {
        const getFunction = async () => {
          const fileUrl = await getFileUrl({
            storageId: file[2] as Id<"_storage">,
          });
          if (!fileUrl) {
            return;
          }
          const data = await fetchAndReadStreamData(fileUrl);
          setRecievedData(data);
        };
        getFunction();
      }
    }
  }, [file]);

  const filteredData = filterAndFormatData(recievedData);
  const consoleData = filteredData?.map((value, index) => {
    return <li key={index}>{value}</li>;
  });
  const graphData = getGraphData(filteredData);
  const cardData = getCardsData(filteredData);

  const cardDataComponent = cardData?.map((value, index) => {
    return (
      <Card
        className=" max-w-xs"
        decoration="top"
        decorationColor="indigo"
        key={index}
      >
        <p className="text-center text-xs lg:text-sm dark:text-dark-tremor-content">
          {value.title}
        </p>
        <p className="text-center text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {value.data}
        </p>
      </Card>
    );
  });

  return (
    <section className="h-full overflow-y-scroll px-4 pb-40">
      <p
        className={`mb-4 flex items-center  gap-2  border-0 bg-transparent px-0 text-xs text-lightText outline-none lg:text-base dark:text-darkText`}
      >
        <span
          className={`rounded-full ${device?.isOnline.isOnline ? "bg-green-500" : "bg-red-600"} flex size-2`}
        ></span>
        {` ${device?.isOnline.isOnline ? "conectado, verificado hace" : "desconetado, ultima conexion hace"} `}
        <LastCheckedOnline lastChecked={device?.isOnline.lastCheck} />
      </p>
      <h2 className="my-0 mb-2 border-none bg-transparent px-0 text-xl font-semibold outline-none focus:ring-0 lg:text-4xl">
        {device?.name}
      </h2>
      <p
        className={`mb-4 border-0 bg-transparent px-0 text-sm  text-lightText outline-none lg:text-base dark:text-darkText`}
      >
        {device?.description}
      </p>

      <h3 className="mb-2  text-xl font-medium lg:text-2xl">
        Funciones del dispositivo
      </h3>
      <div className="mb-8 flex w-full auto-rows-max grid-cols-2 flex-col justify-items-center gap-4 text-xs lg:grid lg:text-base  2xl:grid-cols-3">
        {functionscom}
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl  font-medium lg:text-2xl">Datos Recibidos</h3>

        {filteredData.length > 0 ? (
          <button
            className="flex w-fit items-center justify-center gap-2 rounded p-2 text-white lg:bg-accent"
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
            <p className="hidden shrink-0 lg:block">Descargar Datos</p>
            <ArrowDownTray className=" size-5 shrink-0 stroke-lightText lg:stroke-white dark:stroke-darkText" />
          </button>
        ) : (
          <></>
        )}
      </div>
      <p className="mb-2 text-xs text-lightText lg:text-base dark:text-darkText">
        Los datos mostrados son de la ultima funcion ejecutada
      </p>
      <h4 className="mb-2 text-sm lg:text-xl">Consola de comandos</h4>
      <p className="mb-2 text-xs text-lightText lg:text-base dark:text-darkText">
        Esta sección muestra todos los datos recibidos que no se configuraron
        para graficar
      </p>
      <div className="dark:border-darkTex relative mb-4  max-h-32 min-h-20 w-full overflow-y-scroll rounded border border-lightText p-2 text-sm">
        <ul>{consoleData}</ul>
      </div>
      <h4 className="mb-2 text-sm lg:text-xl">Últimos datos recibidos</h4>
      <p className="mb-2 text-xs text-lightText lg:text-base dark:text-darkText ">
        Esta sección muestra los datos configurados como “mostrar ultimo”
      </p>
      <div className="mb-4 flex h-auto items-start justify-start gap-4 overflow-x-scroll ">
        {(cardDataComponent?.length as number) > 0 ? (
          <>{cardDataComponent}</>
        ) : (
          <p>No hay datos configurados para mostrar su ultimo valor</p>
        )}
      </div>
      <h4 className="mb-2 text-sm lg:text-xl">Graficas</h4>
      <p className="mb-2 text-xs text-lightText lg:text-base dark:text-darkText">
        Esta sección muestra los datos configurados como “Graficar”{" "}
      </p>
      {graphData.jsonResult.length > 0 ? (
        <LineChart
          data={graphData.jsonResult}
          index="index"
          categories={graphData.variableNames}
          onValueChange={(v) => console.log(v)}
        />
      ) : (
        <p>No hay datos configurados para graficar</p>
      )}
    </section>
  );
}
