"use client";
import { Form } from "components/primitives/Form";
import { useFieldArray, useForm } from "react-hook-form";
import {
  deviceFunctionForm,
  type deviceFunctionFormType,
} from "types/deviceFunctionClientData";
import { zodResolver } from "@hookform/resolvers/zod";
import Name from "./functionComponents/Name";
import Description from "./functionComponents/Description";
import TypeOfFunction from "./functionComponents/TypeOfFunction";
import Message from "./functionComponents/Message";
import SendaData from "./functionComponents/SendData";
import Command from "./functionComponents/Command";
import UserInfo from "./functionComponents/UserInfo";
import TypeOfEntry from "./functionComponents/TypeOfEntry";
import Format from "./functionComponents/Format";
import Unit from "./functionComponents/Unit";
import MinInterval from "./functionComponents/MinInterval";
import MaxInterval from "./functionComponents/MaxInterval";
import ScaleData from "./functionComponents/ScaleData";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "components/primitives/Button";
import EliminationAlert from "../EliminationAlert";

const FunctionInitialState: deviceFunctionFormType = {
  id: "",
  name: "",
  description: "",
  typeOfFunction: "FREE",
  command: "",
  userInfo: false,
  userTypeOfEntry: "NUMBER",
  unit: "",
  format: "SCALE",
  maxInterval: "0",
  minInterval: "0",
  scaleData: [],
  message: "",
  sendData: false,
};
export default function FunctionForm(props: {
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  submitHandler: (data: deviceFunctionFormType) => void;
  functionData: deviceFunctionFormType | undefined;
  setFunctionId: Dispatch<SetStateAction<string | undefined>>;
  deleteHandler: (id: string) => void;
}) {
  const initialState = props.functionData
    ? props.functionData
    : FunctionInitialState;
  const [scaleError, setScaleError] = useState(false);

  const form = useForm<deviceFunctionFormType>({
    resolver: zodResolver(deviceFunctionForm),
    defaultValues: initialState,
  });
  const watchTypeOfFunction = form.watch("typeOfFunction");
  const watchUserInfo = form.watch("userInfo");
  const watchTypeOfEntry = form.watch("userTypeOfEntry");
  const watchFormat = form.watch("format");
  const watchScale = form.watch("scaleData");
  const isScaleDataDisabled = watchScale.some(
    (element) => element.value.toString() === "",
  );
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 rounded border border-lightText/60 bg-white px-4 py-4 dark:border-darkText dark:bg-dark"
        onSubmit={form.handleSubmit(props.submitHandler, (e) => {
          e.scaleData ? setScaleError(true) : setScaleError(false);
          console.log(e);
        })}
      >
        <Name control={form.control} />
        <Description control={form.control} />
        <TypeOfFunction control={form.control} />
        {watchTypeOfFunction === "COMMAND" ? (
          <>
            <Command control={form.control} />
            <UserInfo control={form.control} />
            {watchUserInfo && (
              <>
                <TypeOfEntry control={form.control} />
                {watchTypeOfEntry === "STRING" ? (
                  <>
                    <Format isText={true} control={form.control} />
                    {watchFormat === "SCALE" && (
                      <>
                        <Unit control={form.control} />
                        <ScaleData
                          typeOfEntry={watchTypeOfEntry}
                          setValue={form.setValue}
                          isError={scaleError}
                          isDisabled={isScaleDataDisabled}
                          setError={setScaleError}
                          currentValues={watchScale}
                        />
                      </>
                    )}
                    <Message control={form.control} />
                  </>
                ) : (
                  <>
                    <Format isText={false} control={form.control} />
                    {watchFormat === "INTERVAL" && (
                      <>
                        <Unit control={form.control} />
                        <div className="my-2 flex flex-col justify-between gap-2 lg:w-1/2 lg:flex-row">
                          <MinInterval control={form.control} />
                          <MaxInterval control={form.control} />
                        </div>
                      </>
                    )}
                    {watchFormat === "SCALE" && (
                      <>
                        <Unit control={form.control} />
                        <ScaleData
                          setValue={form.setValue}
                          typeOfEntry={watchTypeOfEntry}
                          isError={scaleError}
                          isDisabled={isScaleDataDisabled}
                          setError={setScaleError}
                          currentValues={watchScale}
                        />
                      </>
                    )}
                    <Message control={form.control} />
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Message control={form.control} />
          </>
        )}
        <h3 className="text-center text-sm font-bold lg:text-left  lg:text-xl ">
          Datos de Salida
        </h3>
        <SendaData control={form.control} />
        <div className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-center gap-8 border-t border-t-lightText/60 bg-white drop-shadow lg:absolute lg:justify-end lg:px-12 dark:border-t-darkText dark:bg-dark">
          {props.functionData && (
            <EliminationAlert
              onSubmitAction={() => {
                props.deleteHandler(props.functionData?.id as string);
              }}
              isDevice={false}
              name={props.functionData.name}
            />
          )}
          <Button
            className="rounded border border-danger bg-transparent px-8 py-2 text-sm text-danger"
            type="button"
            onClick={() => {
              if (props.functionData) {
                props.setFunctionId(undefined);
              }
              props.setIsCreating(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            className="rounded border border-accent bg-transparent px-8 py-2 text-sm text-accent dark:text-indigo-400"
            type="submit"
          >
            Guardar Funcion
          </Button>
        </div>
      </form>
    </Form>
  );
}
