"use client";

import { useAppDispatch } from "lib/hooks";
import { updateDataBaseData } from "lib/features/databaseData/dataBaseDataSlice";

import { useSession } from "@clerk/clerk-react";

import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";

import type { databaseDataFormat, invitation } from "types/databaseData";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useSession();
  const dispatch = useAppDispatch();

  const invitationsByUser = useQuery(api.invitations.getInvitationByUser);
  const userActiveTeam = useQuery(api.user.getUserActiveTeam);
  const userActiveTeamInfo = useQuery(api.team.getActiveTeamInfo);
  const userTeams = useQuery(api.team.getUserTeams);
  if (!userActiveTeam || !userActiveTeamInfo || !userTeams || !user.session) {
    return;
  }

  const databaseData: databaseDataFormat = {
    invitationsByUser: invitationsByUser as invitation,
    userActiveTeam: userActiveTeam,
    userActiveTeamInfo: userActiveTeamInfo,
    userTeams: userTeams,
    currentUser: user.session as any,
  };

  dispatch(updateDataBaseData(databaseData));

  return <>{children}</>;
}
