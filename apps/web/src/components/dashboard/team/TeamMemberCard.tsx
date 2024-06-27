import { ClockIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function TeamMemberCard(props: {
  userName: string | undefined;
  isPending: boolean;
  isAdmin: boolean;
}) {
  if (!props.userName) {
    return;
  }
  return (
    <div
      className={`flex w-full items-center justify-between rounded-md border border-lightText px-4 py-2 dark:border-darkText ${props.isPending ? "border-neutral-100 bg-neutral-100 dark:border-neutral-800/90 dark:bg-neutral-800/90" : ""}`}
    >
      <div className="flex items-center justify-center gap-4">
        <span className="flex size-10 items-center justify-center rounded-full border border-accent text-accent">
          {props.userName.charAt(0).toUpperCase()}
        </span>
        <p>{props.userName}</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <>
          {props.isPending ? (
            <ClockIcon className="size-5 stroke-yellow-500" />
          ) : (
            <></>
          )}
        </>
        <>
          {props.isAdmin ? (
            <span>
              <ExclamationTriangleIcon className="size-5 stroke-danger" />
            </span>
          ) : (
            <></>
          )}
        </>
      </div>
    </div>
  );
}
