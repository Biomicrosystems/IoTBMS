"use client";
import { usePathname, useRouter } from "next/navigation";

import Notifications from "components/dashboard/navigation/Notifications";
import ThemeSwitch from "components/common/ThemeSwitch";

import type { ActiveSessionResource } from "@clerk/types";

import type { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/primitives/Select";

import { Doc } from "convex/_generated/dataModel";
import { HamburgerMenuIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Separator } from "components/primitives/Separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "components/primitives/Sheet";
import MenuContent from "./MenuContent";

export default function Topbar(props: {
  currentTeam: Doc<"team">;
  currentUser: ActiveSessionResource;
  isAdmin: boolean;
}) {
  const currentUrl = usePathname();
  const router = useRouter();

  const isAdmin = props.currentTeam.adminId === props.currentUser.user.id;
  const adminUrl = currentUrl.includes("admin");

  let navigationIndicator = "Dispositivos";
  if (currentUrl.includes("devices")) {
    navigationIndicator = "Dispositivos";
  }
  if (currentUrl.includes("logs")) {
    navigationIndicator = "Historial";
  }
  if (currentUrl.includes("team")) {
    navigationIndicator = "Equipo";
  }
  if (currentUrl.includes("teams")) {
    navigationIndicator = "Tus equipos";
  }

  return (
    <nav className="flex w-full items-center justify-between px-4 py-4 lg:px-0 lg:py-6">
      <div className="flex items-center justify-center gap-2">
        <Sheet>
          <SheetTrigger className="lg:hidden">
            <HamburgerMenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="inset-y-0 left-0 h-full w-3/4 border-r border-none bg-white data-[state=closed]:duration-150 data-[state=open]:duration-150 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm dark:bg-dark"
          >
            <MenuContent isAdmin={props.isAdmin} />
          </SheetContent>
        </Sheet>
        <h1 className="shrink-0 text-sm font-bold lg:text-base">
          {navigationIndicator}
        </h1>
        <Separator
          orientation="vertical"
          className="h-4 bg-lightText dark:bg-darkText"
        />
        {!isAdmin ? (
          <p className="font-bold">Usuario</p>
        ) : (
          <Select
            onValueChange={(value) => {
              const route = currentUrl.includes(value);
              if (!route) {
                const newRoute = currentUrl.replace(
                  /\/admin|\/user/g,
                  `${value}/`,
                );
                router.push(`${newRoute}`);
              }
            }}
          >
            <SelectTrigger className=" h-full animate-openMenu rounded-sm  border-none p-0 font-bold text-black shadow-none ring-0 lg:text-base dark:text-white">
              <SelectValue placeholder={adminUrl ? "Admin" : "Usuario"} />
            </SelectTrigger>

            <SelectContent className="animate-openMenu bg-white dark:bg-dark">
              <SelectGroup>
                <SelectItem
                  value="/user"
                  className="focus:bg-black/10 dark:focus:bg-white/10"
                >
                  Usuario
                </SelectItem>
                <SelectItem
                  value="/admin"
                  className="focus:bg-black/10 dark:focus:bg-white/10"
                >
                  Admin
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="flex items-center justify-center gap-4">
        <ThemeSwitch />
        <a href="https://iot-control-convex-docs.vercel.app/" target="_blank">
          <InfoCircledIcon className="size-6 text-lightText dark:text-darkText" />
        </a>
        <Notifications />
      </div>
    </nav>
  );
}
