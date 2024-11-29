"use client";

import { api } from "convex/_generated/api";
import { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useAppSelector } from "lib/hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function SearchNewMember(props: {
  setIsSearchUser: Dispatch<SetStateAction<boolean>>;
}) {
  const [selectedPerson, setSelectedPerson] = useState<Doc<"user"> | null>(
    null,
  );
  const [inputText, setInputText] = useState<string | undefined>();

  const [currentOptions, setCurrentOptions] = useState<Doc<"user">[]>([]);
  const currentTeamId = useAppSelector(
    (state) => state.databaseData.userActiveTeam,
  );
  const getUsers = useMutation(api.user.getUserbyUserName);

  const listItems = currentOptions.map((option) => {
    return <li onClick={() => setSelectedPerson(option)}>{option.userName}</li>;
  });

  useEffect(() => {
    if (!inputText) {
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
            className="w-full rounded-md"
            placeholder="Nombre de usuario"
            value={inputText}
            onFocus={() => setInputText("")}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <div className="absolute mt-2 max-h-40 w-full rounded-lg border bg-white pl-3 shadow-md dark:bg-dark">
            <ul>{listItems}</ul>
          </div>
        </div>

        <button
          disabled={!selectedPerson ? true : false}
          className="mb-4 h-10 rounded bg-accent p-2 text-sm text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:text-zinc-100"
        >
          Enviar invitacion
        </button>
        <button
          onClick={() => {
            props.setIsSearchUser(false);
          }}
          className="h-10 rounded-sm border border-danger p-2 text-sm text-danger transition hover:bg-red-50 "
        >
          Cancelar
        </button>
      </div>
    </span>
  );
}
