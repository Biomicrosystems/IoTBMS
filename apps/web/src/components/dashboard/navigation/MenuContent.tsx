"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MobileThemeSwitch from "components/common/MobileThemeSwitch";

import { SignOutButton } from "@clerk/clerk-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "components/primitives/Select";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useAppSelector } from "lib/hooks";

export default function MenuContent(props: { isAdmin: boolean }) {
  const userTeams = useAppSelector((state) => state.databaseData.userTeams);

  const userActiveTeamInfo = useAppSelector(
    (state) => state.databaseData.userActiveTeamInfo,
  );
  const currentUser = useAppSelector((state) => state.databaseData.currentUser);
  const router = useRouter();

  const selectTeam = useMutation(api.user.setActiveTeam);

  const teamOptions = userTeams.map((team) => {
    return (
      <SelectItem
        value={team._id}
        className="focus:bg-black/10 dark:focus:bg-white/10"
        key={team._id}
      >
        {team.name}
      </SelectItem>
    );
  });
  return (
    <div className="flex h-full flex-col pt-4">
      <Select
        onValueChange={(value) => {
          router.replace("/user");
          selectTeam({
            teamId: value as Id<"team">,
            userID: currentUser.user.id,
          });
        }}
      >
        <SelectTrigger className="shrink-0 animate-openMenu  rounded-sm border-none p-0 font-bold text-black shadow-none ring-0 lg:px-4 lg:text-base dark:text-white">
          {userActiveTeamInfo.name}
        </SelectTrigger>
        <SelectContent className="animate-openMenu bg-white dark:bg-dark">
          {teamOptions}
        </SelectContent>
      </Select>

      <div className="h-full ">
        <ul className="font-medium">
          <Link href={`/${props.isAdmin ? "admin" : "user"}`}>
            <li className="py-2 hover:bg-black/10 lg:px-4 dark:hover:bg-white/10">
              Dispositivos
            </li>
          </Link>
          <Link href={`/${props.isAdmin ? "admin" : "user"}/team `}>
            <li className="py-2 hover:bg-black/10 lg:px-4 dark:hover:bg-white/10">
              Miembros
            </li>
          </Link>
          <Link href={`/${props.isAdmin ? "admin" : "user"}/teams `}>
            <li className="py-2 hover:bg-black/10 lg:px-4 dark:hover:bg-white/10">
              Equipos
            </li>
          </Link>
        </ul>
      </div>
      <MobileThemeSwitch />
      <div className="shrink-0 p-0 lg:px-4">
        <p className="py-2 pl-1 text-base font-medium ">
          {currentUser.user.username}
        </p>
        <SignOutButton>
          <button className="w-full justify-center rounded border border-lightText/60 py-2 text-center text-xs text-lightText transition hover:bg-neutral-50 lg:text-sm dark:border-darkText dark:text-darkText">
            Cerrar Sesión
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
