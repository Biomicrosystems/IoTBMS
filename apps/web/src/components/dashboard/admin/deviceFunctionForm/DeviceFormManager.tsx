"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/primitives/Form";
import { Input } from "components/primitives/Input";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import FunctionForm from "./FunctionForm";
import {
  deviceFunctionFormType,
  formSchema,
  formSchemaType,
} from "types/deviceFunctionClientData";
import { PlusIcon } from "@radix-ui/react-icons";

import { Button } from "components/primitives/Button";
import FunctionCardView from "./FunctionCardView";
import EliminationAlert from "../EliminationAlert";

export default function DeviceFormManager(props: {
  submitHandler: (data: formSchemaType) => void;
  functionData: deviceFunctionFormType[];
  functionSubmitHandler: (data: deviceFunctionFormType) => void;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  isCreating: boolean;
  cancelHandler: () => void;
  functionDeleteHandler: (id: string) => void;
  deviceInitialState: formSchemaType;
  deviceDeleteHandler: undefined | (() => void);
}) {
  const [functionId, setFunctionId] = useState<undefined | string>(undefined);
  const functionDataByID = props.functionData.find(
    (data) => data.id === functionId,
  );
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: props.deviceInitialState,
  });

  const functionComponents = props.functionData.map((data) => {
    return (
      <FunctionCardView
        name={data.name}
        setIsEditing={props.setIsCreating}
        functionId={data.id}
        setFunctionId={setFunctionId}
        key={data.id}
      />
    );
  });

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col pt-4"
          onSubmit={form.handleSubmit(props.submitHandler)}
        >
          <FormField
            control={form.control}
            name="deviceName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="my-0 mb-4 border-none bg-transparent px-0 font-semibold outline-none focus:ring-0 lg:text-4xl"
                    {...field}
                    autoComplete="off"
                    placeholder="Nombre"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceDescription"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className={` mb-4 rounded-none border-0 border-b  bg-transparent px-0 text-sm outline-none focus:ring-0 lg:text-base `}
                    {...field}
                    autoComplete="off"
                    placeholder="Descripción"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!props.isCreating && (
            <div className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-center gap-8 border-t border-t-lightText/60 bg-white drop-shadow lg:absolute lg:justify-end lg:px-12 dark:border-t-darkText dark:bg-dark">
              {props.deviceDeleteHandler && (
                <EliminationAlert
                  name={props.deviceInitialState.deviceName}
                  onSubmitAction={props.deviceDeleteHandler}
                  isDevice={true}
                />
              )}
              <Button
                className="rounded border border-danger bg-transparent px-8 py-2 text-sm text-danger transition hover:bg-red-50 dark:hover:bg-danger/10"
                type="button"
                onClick={props.cancelHandler}
              >
                Cancelar
              </Button>
              <Button
                className="rounded border border-accent bg-transparent px-8 py-2 text-sm text-accent transition hover:bg-indigo-50/60 dark:text-indigo-400 hover:dark:bg-accent/10"
                type="submit"
              >
                {props.deviceDeleteHandler !== undefined
                  ? "Guardar dispositivo"
                  : "Crear Dispositivo"}
              </Button>
            </div>
          )}
        </form>
      </Form>

      <h2 className=" mt-2  font-medium lg:text-2xl">
        Funciones del dispositivo
      </h2>
      <p className=" mb-4  py-2 text-sm font-medium text-lightText lg:text-base dark:text-darkText">
        Oprime el botón para crear una nueva función de tu dispositivo
      </p>

      {!props.isCreating ? (
        <div className="mb-4 flex flex-col gap-4">
          {functionComponents}
          <button
            onClick={() => {
              props.setIsCreating(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded border border-lightText bg-white py-2 text-sm text-lightText transition  hover:bg-neutral-50  lg:text-base dark:border-darkText dark:bg-dark dark:text-darkText dark:hover:bg-white/10"
          >
            <PlusIcon className="size-4" />
            Añadir nueva funcion
          </button>
        </div>
      ) : (
        <FunctionForm
          setIsCreating={props.setIsCreating}
          submitHandler={props.functionSubmitHandler}
          functionData={functionDataByID}
          setFunctionId={setFunctionId}
          deleteHandler={props.functionDeleteHandler}
        />
      )}
    </>
  );
}
