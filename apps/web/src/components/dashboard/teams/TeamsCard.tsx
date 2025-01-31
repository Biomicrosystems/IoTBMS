import { Id } from "convex/_generated/dataModel";

export default function TeamsCard(props: { TeamName: string }) {
  return (
    <div
      className={`flex w-full items-center justify-between rounded-md border border-lightText px-4 py-2 dark:border-darkText`}
    >
      <div className="flex items-center justify-center gap-4">
        <span className="flex size-10 items-center justify-center rounded-full border border-accent text-accent">
          {props.TeamName.charAt(0).toUpperCase()}
        </span>
        <p>{props.TeamName}</p>
      </div>
    </div>
  );
}
