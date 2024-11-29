"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "img/Logo.png";

import { useUser } from "@clerk/clerk-react";

import { useState } from "react";

import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/primitives/Select";

export default function SelectTeam() {
  const router = useRouter();

  const user = useUser();

  const queryData = useQuery(api.invitations.getInvitationByUser);
  const selectTeam = useMutation(api.user.setActiveTeam);
  const acceptInvitation = useMutation(api.invitations.setInvitationAccepted);
  const createTeam = useMutation(api.team.createTeam);

  const [selectedId, setSelectedID] = useState("");

  const teamsInvitation = queryData?.invitations.map((data) => {
    const teamInfo = queryData?.teams.find((team) => team._id === data.teamId);
    return (
      <SelectItem
        value={`${teamInfo?.name};${data._id}:${teamInfo?._id}`}
        key={data._id as string}
        className="focus:bg-black/10 dark:focus:bg-white/10 "
      >
        {teamInfo?.name}
      </SelectItem>
    );
  });

  return (
    <div className=" flex h-screen w-full items-center justify-center px-4">
      <div className="flex w-full flex-col  p-4  lg:w-500px">
        <Image
          src={logo}
          alt="Logo"
          className="mb-4 h-10 w-12 self-center lg:h-14 lg:w-16"
        />
        <h2 className="text-xl font-semibold lg:text-center lg:text-4xl">
          Crea un nuevo equipo
        </h2>
        <p className="mb-6 text-sm text-lightText lg:text-center lg:text-base dark:text-darkText">
          O unete a un equipo por invitación
        </p>
        <form
          className="flex w-full flex-col"
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const description = formData.get("description") as string;

            if (name !== "" && description !== "") {
              createTeam({
                name: name,
                description: description,
              });
              router.push("/admin");
            }
          }}
        >
          <label className=" text-xs font-bold lg:text-base"> Nombre</label>
          <input
            className="mb-4 border-lightText/60 bg-transparent dark:border-darkText/60"
            name="name"
            placeholder={`Equipo de ${user.user?.username}`}
          />
          <label className="  text-xs font-bold lg:text-base">
            Descripción
          </label>
          <input
            className="mb-4 border-lightText/60 bg-transparent dark:border-darkText/60"
            name="description"
            placeholder={`Equipo personal de ${user.user?.username}`}
          />

          <button className="mb-10 w-full rounded bg-accent py-2 text-xs text-white lg:text-base">
            Crear
          </button>
        </form>
        <h2 className="text-xl font-semibold lg:text-center lg:text-4xl">
          Tus invitaciones
        </h2>
        <p className="text-sm  text-lightText lg:mb-4 lg:text-center lg:text-base dark:text-darkText">
          Pidele a un administrador de equipo que te invite
        </p>

        <Select
          onValueChange={(value) => {
            const [name, id] = value.split(";");
            setSelectedID(id);
            return;
          }}
        >
          <SelectTrigger
            className="mb-4 w-full rounded-sm text-lightText  lg:text-base dark:text-darkText"
            disabled={teamsInvitation ? false : true}
          >
            <SelectValue
              placeholder={
                teamsInvitation
                  ? "Seleciona una invitacion a un equipo"
                  : "No hay invitaciones disponbiles"
              }
            />
          </SelectTrigger>
          {!teamsInvitation ?? (
            <SelectContent className="animate-openMenu bg-white dark:bg-dark">
              <SelectGroup>{teamsInvitation}</SelectGroup>
            </SelectContent>
          )}
        </Select>

        <button
          className="mb-10 w-full rounded bg-accent py-2 text-xs text-white lg:text-base"
          onClick={() => {
            const [invitationID, teamID] = selectedId.split(":");
            router.replace("/user");
            selectTeam({
              teamId: teamID as Id<"team">,
              userID: user.user?.id as string,
            });
            acceptInvitation({
              invitationId: invitationID as Id<"invitations">,
            });
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
