"use client";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useAppSelector } from "lib/hooks";
import TeamMemberCard from "./TeamMemberCard";
import { useState } from "react";
import SearchNewMember from "./SearchNewMember";
import { PlusIcon } from "@radix-ui/react-icons";

export default function TeamPage(props: { isAdmin: boolean }) {
  const [isSearchUser, setIsSearchUser] = useState(false);

  const currentTeamInfo = useAppSelector(
    (state) => state.databaseData.userActiveTeamInfo,
  );

  const usersInTeam = useQuery(api.team.getTeamUsersInfo, {
    teamId: currentTeamInfo._id,
  });

  const pendingUser = useQuery(api.invitations.getUserInvitationInfoByTeamId, {
    teamId: currentTeamInfo._id,
  });
  const userMemberCards = usersInTeam?.teamUsers.map((user, index) => {
    return (
      <TeamMemberCard
        key={index}
        userName={user}
        isPending={false}
        isAdmin={props.isAdmin}
        teamId={currentTeamInfo._id}
      />
    );
  });

  const pendingUserCards = pendingUser?.map((user, index) => {
    return (
      <TeamMemberCard
        key={index}
        userName={user}
        isPending={true}
        isAdmin={props.isAdmin}
        teamId={currentTeamInfo._id}
      />
    );
  });
  return (
    <section className="h-full overflow-y-scroll px-4 pb-40">
      <h2 className="my-0 mb-6 border-none bg-transparent px-0 text-xl font-semibold outline-none focus:ring-0 lg:text-4xl">
        {currentTeamInfo.name}
      </h2>
      <h3 className="mb-4 font-medium lg:text-xl">Administrador</h3>
      <div className="mb-4 auto-rows-max grid-cols-2 gap-x-20  lg:grid">
        <TeamMemberCard
          userName={usersInTeam?.adminUser}
          isPending={false}
          teamId={currentTeamInfo._id}
          isAdmin={false}
        />
      </div>
      <h3 className="mb-4 font-medium lg:text-xl">Integrantes</h3>

      <div className=" flex auto-rows-min grid-cols-2 flex-col gap-2 gap-x-20 gap-y-6 lg:grid ">
        {userMemberCards}
        {pendingUserCards}
        {props.isAdmin ? (
          <button
            onClick={() => {
              setIsSearchUser(true);
            }}
            className="flex w-full items-center  justify-center gap-4 rounded-md border border-lightText p-4 text-sm text-lightText transition fade-in-100  hover:bg-neutral-50 hover:bg-neutral-50 dark:border-darkText dark:border-darkText dark:text-darkText dark:hover:bg-white/10"
          >
            <PlusIcon className="size-5 text-lightText  dark:text-darkText " />
            Añadir nuevo integrante
          </button>
        ) : (
          <></>
        )}
      </div>

      {isSearchUser ? (
        <SearchNewMember setIsSearchUser={setIsSearchUser} />
      ) : (
        <></>
      )}
    </section>
  );
}
