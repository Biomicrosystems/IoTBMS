"use client";
import { useAppSelector } from "lib/hooks";
import { PlusIcon } from "@radix-ui/react-icons";
import TeamsCard from "./TeamsCard";
import { useState } from "react";
import CreateNewTeam from "./CreateNewTeam";

export default function TeamsPage(props: { isAdmin: boolean }) {
  const [creatingTeam, setCreatingTeam] = useState(false);
  const userTeams = useAppSelector((state) => state.databaseData.userTeams);
  const userData = useAppSelector((state) => state.databaseData.currentUser);

  const userTeamsCards = userTeams.map((team, index) => {
    return <TeamsCard TeamName={team.name} key={index} />;
  });

  return (
    <section className="h-full overflow-y-scroll px-4 pb-40">
      <h2 className="my-0 mb-6 border-none bg-transparent px-0 text-xl font-semibold outline-none focus:ring-0 lg:text-4xl">
        {userData.user.username}
      </h2>
      <h3 className="mb-4 font-medium lg:text-xl">Tus Equipos</h3>

      <div className=" flex auto-rows-min grid-cols-2 flex-col gap-2 gap-x-20 gap-y-6 lg:grid ">
        {userTeamsCards}
        {props.isAdmin && (
          <button
            onClick={() => {
              setCreatingTeam(true);
            }}
            className="flex w-full items-center  justify-center gap-4 rounded-md border border-lightText p-4 text-sm text-lightText transition fade-in-100   hover:bg-neutral-50  dark:border-darkText dark:text-darkText dark:hover:bg-white/10"
          >
            <PlusIcon className="size-5 text-lightText  dark:text-darkText " />
            Crear un nuevo Equipo
          </button>
        )}
      </div>
      {creatingTeam && <CreateNewTeam setIsCreatingTeam={setCreatingTeam} />}
    </section>
  );
}
