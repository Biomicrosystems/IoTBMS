"use client";
import Link from "next/link";

import DeviceList from "components/dashboard/DeviceList";

import { useAppDispatch, useAppSelector } from "lib/hooks";
import { cleanDeviceFunctionClientData } from "lib/features/deviceFunctionClientData/deviceFunctionClientDataSlice";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const currentDeviceFunctions = useAppSelector(
    (state) => state.deviceFunctionClientData,
  );
  if (currentDeviceFunctions.length > 0) {
    dispatch(cleanDeviceFunctionClientData());
  }
  return (
    <section className="flex h-full  auto-rows-max grid-cols-2 flex-col justify-items-center gap-4 overflow-y-scroll px-5 pb-20 lg:grid 2xl:grid-cols-3 2xl:pb-32">
      <DeviceList isAdmin={true} />
      <Link
        href={"/admin/newDevice"}
        className="dark:border-darkTex flex w-full shrink-0 flex-col items-center justify-center gap-2 rounded border border-lightText p-4 transition fade-in-100 hover:bg-neutral-50 lg:h-40 2xl:h-44 2xl:w-full dark:hover:bg-white/10 "
      >
        <PlusIcon className="size-10 text-lightText 2xl:size-16 dark:text-darkText" />
        <p className="text-sm text-lightText  2xl:text-base dark:text-darkText">
          Añadir dispositivo
        </p>
      </Link>
    </section>
  );
}
