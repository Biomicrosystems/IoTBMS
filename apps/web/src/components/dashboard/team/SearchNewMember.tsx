"use client";

import { useToast } from "components/primitives/useToast";
import { api } from "convex/_generated/api";
import { Doc, Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useAppSelector } from "lib/hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { cn } from "utils/cnHelper";

export default function SearchNewMember(props: {
  setIsSearchUser: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const [selectedPerson, setSelectedPerson] = useState<Doc<"user"> | null>(
    null,
  );
  const [inputText, setInputText] = useState<string | undefined>();

  const [currentOptions, setCurrentOptions] = useState<Doc<"user">[]>([]);
  const currentTeamId = useAppSelector(
    (state) => state.databaseData.userActiveTeam,
  );
  const getUsers = useMutation(api.user.getUserbyUserName);
  const sendInvitation = useMutation(api.invitations.createInvitation);
  const listItems = currentOptions.map((option) => {
    return (
      <li
        className="relative flex w-full items-center rounded-sm py-1.5 pl-3 pr-8 text-sm outline-none hover:bg-accent hover:bg-black/10  dark:hover:bg-white/10"
        onClick={() => {
          setSelectedPerson(option);
          setInputText(option.userName);
          setCurrentOptions([]);
        }}
      >
        {option.userName}
      </li>
    );
  });

  useEffect(() => {
    if (!inputText) {
      return;
    }
    if (selectedPerson) {
      return;
    }
    if (inputText.length >= 3) {
      getUsers({ userName: inputText }).then((data) => {
        setCurrentOptions(data);
      });
    } else {
      setCurrentOptions([]);
    }
  }, [inputText]);
  return (
    <span
      className={`fixed left-0 top-0  z-10 flex h-screen w-screen items-center justify-center bg-black/15 px-4 transition-all dark:bg-black/65`}
    >
      <div className="flex h-fit w-screen flex-col  rounded-lg bg-white px-5 py-8 lg:w-500px dark:bg-dark">
        <p className="mb-4 text-sm ">
          Busca a nuevos miembros por nombre de usuario
        </p>
        <div className="relative mb-8 w-full ">
          <input
            className="w-full rounded-md dark:bg-dark dark:text-white"
            placeholder="Nombre de usuario"
            value={inputText}
            onFocus={() => {
              setInputText("");
              setSelectedPerson(null);
            }}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <div
            className={cn(
              "absolute mt-2 max-h-40 w-full rounded-lg border bg-white shadow-md transition-all dark:bg-dark ",
              listItems.length > 0 ? "visible" : "hidden",
            )}
          >
            <ul>{listItems}</ul>
          </div>
        </div>

        <button
          disabled={!selectedPerson ? true : false}
          className="mb-4 h-10 rounded bg-accent p-2 text-sm text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:text-zinc-100 dark:disabled:bg-indigo-400"
          onClick={async () => {
            console.log(selectedPerson);
            console.log(currentTeamId);
            const res = await sendInvitation({
              userId: selectedPerson?.userId as string,
              teamId: currentTeamId,
            });
            if (res?.result) {
              toast({
                title: "Se ha enviado la invitación con exito",
                variant: "success",
              });
              props.setIsSearchUser(false);
              return;
            }
            toast({
              title: "No se ha podido enviar la invitacion",
              variant: "destructive",
            });

            props.setIsSearchUser(false);
            return;
          }}
        >
          Enviar invitacion
        </button>
        <button
          onClick={() => {
            props.setIsSearchUser(false);
          }}
          className="h-10 rounded-sm border border-danger p-2 text-sm text-danger transition hover:bg-red-50 dark:hover:bg-danger/10 "
        >
          Cancelar
        </button>
      </div>
    </span>
  );
}
