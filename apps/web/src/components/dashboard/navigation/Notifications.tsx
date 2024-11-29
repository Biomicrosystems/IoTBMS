import { useAppSelector } from "lib/hooks";

import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/primitives/DropdownMenu";

import { BellIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

export default function Notifications() {
  const invitationsByUser = useAppSelector(
    (state) => state.databaseData.invitationsByUser,
  );

  const acceptInvitation = useMutation(api.invitations.setInvitationAccepted);
  const rejectInvitation = useMutation(api.invitations.setInvitationRejected);

  const currentInvitations = invitationsByUser?.invitations.map((data: any) => {
    const teamInfo = invitationsByUser?.teams.find(
      (team: any) => team._id === data.teamId,
    );
    return (
      <DropdownMenuItem
        className="flex items-center gap-6 p-0 px-4 pt-4  text-sm font-light focus:bg-white dark:focus:bg-dark"
        key={data._id}
      >
        <span className="dark:text-darktext flex size-8 shrink-0 items-center justify-center rounded-full border border-accent text-xs text-accent lg:text-base dark:border-darkText dark:text-darkText">
          {teamInfo?.name.charAt(0)}
        </span>
        <p className="flex w-52 flex-wrap items-center justify-center text-left text-xs lg:text-sm ">
          Te han invitado a unirte al equipo {teamInfo?.name}
        </p>
        <div className=" flex items-center justify-center gap-4">
          <button onClick={() => acceptInvitation({ invitationId: data._id })}>
            <CheckIcon className="size-5 text-green-600" />
          </button>
          <button onClick={() => rejectInvitation({ invitationId: data._id })}>
            <Cross2Icon className="size-5 text-red-600" />
          </button>
        </div>
      </DropdownMenuItem>
    );
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <BellIcon className="size-6 text-lightText dark:text-darkText " />
        {!currentInvitations ?? (
          <span className="absolute right-[12%] top-[12%] size-2 rounded-full bg-danger" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="animate-openMenu  flex-col gap-2 rounded bg-white p-0 py-4  shadow-lg ring-1 ring-lightText/20 focus:outline-none lg:w-96 dark:bg-dark  dark:ring-darkText"
        sideOffset={8}
      >
        <h3 className="px-4 text-sm font-medium lg:text-base">
          Notificaciones
        </h3>
        <p className="border-b border-b-lightText/20 px-4  pb-2 text-xs text-lightText lg:text-sm dark:border-darkText dark:text-darkText">
          Acepta o Rechaza las invitaciones a otros equipos
        </p>

        {currentInvitations ? (
          currentInvitations
        ) : (
          <p className=" flex items-center justify-center pt-4 text-center text-xs text-lightText lg:text-sm dark:text-darkText">
            No hay invitaciones
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
