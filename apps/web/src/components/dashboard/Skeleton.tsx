"use client";
import Sidebar from "components/dashboard/navigation/Sidebar";
import Topbar from "components/dashboard/navigation/Topbar";

import { useAppSelector } from "lib/hooks";

export default function Skeleton(props: {
  children: React.ReactNode;
  isAdmin: boolean;
}) {
  const userActiveTeamInfo = useAppSelector(
    (state) => state.databaseData.userActiveTeamInfo,
  );
  const currentUser = useAppSelector((state) => state.databaseData.currentUser);
  return (
    <main className="flex h-svh w-screen lg:max-h-screen dark:bg-dark">
      <Sidebar isAdmin={props.isAdmin} />

      <section className="relative max-h-screen w-full overflow-hidden lg:px-12">
        <Topbar
          currentTeam={userActiveTeamInfo}
          currentUser={currentUser}
          isAdmin={props.isAdmin}
        />

        {props.children}
      </section>
    </main>
  );
}
