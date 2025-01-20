import { api } from "convex/_generated/api";
import { Doc, Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import ExecutionAlert from "../ExecutionAlert";
import { useToast } from "components/primitives/useToast";

export default function FunctionCardExecution(props: {
  functionData: Doc<"deviceFunction">;
}) {
  const { toast } = useToast();
  const [sendConfirmation, setSendConfirmation] = useState(false);
  const createCommand = useMutation(api.command.createCommand);
  return (
    <div className="flex  w-full shrink-0 flex-col gap-2 rounded border border-lightText p-4 lg:h-40 2xl:h-44 2xl:w-full dark:border-darkText">
      <h2 className="text-sm font-bold 2xl:text-xl">
        {props.functionData.name}
      </h2>
      <p className="line-clamp-3 shrink-0 text-xs text-lightText 2xl:text-base dark:text-darkText">
        {props.functionData.description}
      </p>
      <span className="flex h-full items-end justify-end">
        <button
          onClick={() => {
            if (
              props.functionData.userInfo ||
              props.functionData.typeOfFunction == "FREE"
            ) {
              setSendConfirmation(true);
            } else {
              try {
                createCommand({
                  deviceFunctionId: props.functionData
                    ._id as Id<"deviceFunction">,
                  deviceId: props.functionData.deviceId,
                });
                toast({
                  variant: "success",
                  description: "Comando enviado con exito",
                });
              } catch (e: any) {
                toast({
                  variant: "destructive",
                  description: e.message,
                });
              }
            }
          }}
          className="self-end rounded bg-accent p-2 text-sm text-white hover:bg-indigo-700"
        >
          Ejecutar
        </button>
      </span>
      {sendConfirmation ? (
        <ExecutionAlert
          setSendConfirmation={setSendConfirmation}
          functionData={props.functionData}
          serialPort={undefined}
          isAdmin={false}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
