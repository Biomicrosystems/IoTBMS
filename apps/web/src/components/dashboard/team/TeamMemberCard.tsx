import { ClockIcon } from "@radix-ui/react-icons";
import TeamMemberEliminationAlert from "./TeamMemberEliminationAlert";
import { Id } from "convex/_generated/dataModel";

export default function TeamMemberCard(props: {
  userName: string | undefined;
  isPending: boolean;
  teamId: Id<"team">;
  isAdmin: boolean;
}) {
  if (!props.userName) {
    return;
  }
  return (
    <div
      className={`flex w-full items-center justify-between rounded-md border border-lightText px-4 py-2 dark:border-darkText ${props.isPending ? "border-neutral-100 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/90" : ""}`}
    >
      <div className="flex items-center justify-center gap-4">
        <span className="flex size-10 items-center justify-center rounded-full border border-accent text-accent">
          {props.userName.charAt(0).toUpperCase()}
        </span>
        <p>{props.userName}</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <>
          {props.isPending && <ClockIcon className="size-5 text-yellow-500" />}
        </>
        <>
          {props.isAdmin && (
            <TeamMemberEliminationAlert
              name={props.userName}
              teamId={props.teamId}
              isPending={props.isPending}
            />
          )}
        </>
      </div>
    </div>
  );
}
