import ExecutionAlert from "components/dashboard/ExecutionAlert";
import { useToast } from "components/primitives/useToast";
import { Doc } from "convex/_generated/dataModel";
import { useState } from "react";
import { writeToPort } from "utils/serialUtils";

export default function FunctionCard(props: {
  functionData: Doc<"deviceFunction">;
  serialPort: SerialPort | undefined;
}) {
  const [sendConfirmation, setSendConfirmation] = useState(false);

  const { toast } = useToast();
  return (
    <div className="dark:border-darkTex  flex w-full shrink-0 flex-col gap-2 rounded border border-lightText p-4 lg:h-40 2xl:h-44 2xl:w-full">
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
                writeToPort(props.serialPort, props.functionData.command);
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
          className={`self-end rounded  bg-accent p-2  text-sm text-white disabled:bg-indigo-300 disabled:text-zinc-100`}
          disabled={props.serialPort ? false : true}
        >
          {props.serialPort ? "Ejecutar localmente" : "Dispostivo no conectado"}
        </button>
      </span>

      {sendConfirmation && (
        <ExecutionAlert
          setSendConfirmation={setSendConfirmation}
          functionData={props.functionData}
          serialPort={props.serialPort}
          isAdmin={true}
        />
      )}
    </div>
  );
}
