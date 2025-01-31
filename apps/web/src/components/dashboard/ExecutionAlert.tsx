import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Input } from "components/primitives/Input";
import { useToast } from "components/primitives/useToast";
import { api } from "convex/_generated/api";
import { Doc, Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { writeToPort } from "utils/serialUtils";

export default function ExecutionAlert(props: {
  setSendConfirmation: Dispatch<SetStateAction<boolean>>;
  functionData: Doc<"deviceFunction">;
  serialPort: SerialPort | undefined;
  isAdmin: boolean;
}) {
  const { toast } = useToast();
  const createCommand = useMutation(api.command.createCommand);
  const [value, setValue] = useState(props.functionData.minInterval); // Initialize state with the default value
  const [payload, setPayload] = useState<number | string | undefined>(
    undefined,
  );
  let inputReactNode = <></>;
  useEffect(() => {
    if (props.functionData.typeOfFunction == "COMMAND") {
      if (props.functionData.format === "INTERVAL") {
        setPayload(props.functionData.minInterval as number);
      }
      if (props.functionData.format === "SCALE") {
        if (props.functionData.scaleData) {
          setPayload(props.functionData.scaleData[0]);
        }
      }
    }
  }, []);

  if (props.functionData.typeOfFunction === "FREE") {
    const newReactNode = (
      <Input
        type="text"
        className="mb-5 w-full shrink-0 rounded-none border-0 border-b border-b-lightText bg-transparent px-1 py-1 text-sm ring-0 focus:ring-0 dark:border-b-darkText"
        placeholder="Escribe tu comando"
        onBlur={(e) => setPayload(e.target.value)}
      />
    );
    inputReactNode = newReactNode;
  } else {
    if (props.functionData.format === "INTERVAL") {
      const newReactNode = (
        <>
          <span className="relative">
            <Input
              className="my-2 w-10/12 shrink-0 rounded-none border-0 border-b border-b-lightText bg-transparent px-1 py-1 text-sm ring-0 focus:ring-0 dark:border-b-darkText"
              type="number"
              value={value}
              onBlur={() => {
                const formatValue = value ? value : 0;
                const newValue = Math.max(
                  props.functionData.minInterval as number,
                  Math.min(
                    props.functionData.maxInterval as number,
                    Number(formatValue),
                  ),
                );
                setValue(newValue);
                setPayload(newValue);
              }}
              onChange={(event) => {
                const inputValue = event.target.value;
                setValue(inputValue === "" ? undefined : Number(inputValue));
              }}
            />
            <p className="absolute -inset-y-1 right-0 flex items-center text-xs italic">{`${props.functionData.unit}`}</p>
          </span>
          <p className="mb-8 text-xs italic">{`escribe un valor entre ${props.functionData.minInterval} y ${props.functionData.maxInterval}`}</p>
        </>
      );
      inputReactNode = newReactNode;
    }
    if (props.functionData.format === "SCALE") {
      const newReactNode = (
        <>
          <select
            onChange={(e) => {
              setPayload(Number(e.target.value));
            }}
            className="dark: my-2 w-full shrink-0 border-0 border-b border-b-lightText bg-transparent px-1 py-1 text-sm ring-0 focus:ring-0 dark:border-b-darkText"
          >
            {props.functionData.scaleData?.map((data, index) => {
              return (
                <option value={data} key={index}>
                  {data}
                </option>
              );
            })}
          </select>
          <p className=" mb-8 text-xs italic">{`${props.functionData.unit}(${props.functionData.symbol})`}</p>
        </>
      );
      inputReactNode = newReactNode;
    }
  }
  return (
    <span
      className={`fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/15 px-4 transition-all dark:bg-black/65`}
    >
      <div className="flex h-fit w-screen flex-col items-center  rounded-lg bg-white px-5 py-8 animate-in lg:w-500px dark:bg-dark">
        <InfoCircledIcon className="mb-2 size-8 text-accent dark:text-white" />
        <p className="mb-4 text-sm font-bold">
          Esta función requiere información adicional
        </p>
        <p className=" w-full text-left text-sm lg:text-base">
          {`${props.functionData.message}: `}
        </p>
        <form
          className="flex h-full w-full flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (props.isAdmin) {
              try {
                writeToPort(
                  props.serialPort,
                  `${props.functionData.typeOfFunction === "FREE" ? "" : props.functionData.command}${payload}`,
                );
                props.setSendConfirmation(false);
                toast({
                  variant: "success",
                  description: "Funcion enviada con exito",
                });
              } catch (e: any) {
                toast({
                  variant: "destructive",
                  description: e.message,
                });
              }
            } else {
              try {
                createCommand({
                  deviceId: props.functionData.deviceId,
                  deviceFunctionId: props.functionData
                    ._id as Id<"deviceFunction">,
                  payload: payload?.toString(),
                });
                props.setSendConfirmation(false);
                toast({
                  variant: "success",
                  description: "Funcion enviada con exito",
                });
              } catch (e: any) {
                toast({
                  variant: "destructive",
                  description: e.message,
                });
              }
            }
          }}
        >
          {inputReactNode}
          <div className="flex h-full items-end justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                props.setSendConfirmation(false);
              }}
              className="h-10 rounded-sm border border-danger p-2 text-sm text-danger transition hover:bg-red-50 dark:hover:bg-danger/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 rounded bg-accent p-2 text-sm text-white transition hover:bg-indigo-700"
            >
              Ejecutar
            </button>
          </div>
        </form>
      </div>
    </span>
  );
}
