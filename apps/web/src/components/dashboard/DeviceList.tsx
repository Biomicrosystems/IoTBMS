"use client";
import Link from "next/link";

import { useAppSelector } from "lib/hooks";

import { formatUrl } from "utils/urlUtils";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export default function DeviceList(props: { isAdmin: boolean }) {
  const userActiveTeam = useAppSelector(
    (state) => state.databaseData.userActiveTeam,
  );
  const conectedDevices = useAppSelector((state) => state.conectedDevice);
  const devices = useQuery(api.device.getdevices, { teamId: userActiveTeam });

  const deviceItems = devices?.map((device) => {
    const url = formatUrl(device.name, device._id);
    const isDeviceConected = conectedDevices.find(
      (conectedDevice) => conectedDevice.id === device._id,
    );
    return (
      <div
        className="dark:border-darkTex relative flex w-full shrink-0 flex-col gap-2 rounded border border-lightText p-4 lg:h-40 2xl:h-44 2xl:w-full"
        key={device._id}
      >
        <p className="font-medium 2xl:text-xl">{device.name}</p>
        <p className="mb-2 line-clamp-2 shrink-0 text-sm text-lightText 2xl:line-clamp-3 2xl:text-base dark:text-darkText">
          {device.description}
        </p>
        <span className="flex h-full items-end justify-end gap-4">
          <Link
            href={`/${props.isAdmin ? "admin" : "user"}/logs/${url}`}
            className="flex w-24 items-center justify-center rounded border border-black bg-transparent py-2 text-sm transition  hover:bg-neutral-50 dark:border-white dark:hover:bg-white/10"
          >
            Historial
          </Link>
          <Link href={`/${props.isAdmin ? "admin" : "user"}/devices/${url}`}>
            <button
              className={`flex w-24 items-center justify-center rounded  py-2 text-sm text-white transition  disabled:bg-indigo-300 disabled:text-zinc-100 ${isDeviceConected && props.isAdmin ? "bg-sucessText hover:bg-emerald-800" : "bg-accent hover:bg-indigo-700"}`}
              disabled={
                !device.isOnline.isOnline && !props.isAdmin ? true : false
              }
            >
              {isDeviceConected && props.isAdmin ? "Conectado" : "Conectar"}
            </button>
          </Link>
        </span>
        <>
          {props.isAdmin ? (
            <></>
          ) : (
            <span className="absolute right-0 flex items-center justify-center gap-2 pr-4 pt-1">
              <span
                className={`rounded-full ${device.isOnline.isOnline ? "bg-green-500" : "bg-red-600"} flex size-2`}
              ></span>
              <p className="text-xs">
                {device.isOnline.isOnline ? "En linea" : "Desconectado"}
              </p>
            </span>
          )}
        </>
      </div>
    );
  });
  return (
    <>
      {deviceItems?.length ? (
        deviceItems
      ) : (
        <p className="text-center text-sm text-lightText lg:text-base dark:text-darkText">
          No hay Dispositivos para este equipo
        </p>
      )}
    </>
  );
}
