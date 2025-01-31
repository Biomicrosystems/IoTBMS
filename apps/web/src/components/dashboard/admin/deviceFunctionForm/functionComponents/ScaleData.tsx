import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Input } from "components/primitives/Input";
import { Label } from "components/primitives/Label";
import { Dispatch, SetStateAction } from "react";
import { useFieldArray, UseFormSetValue } from "react-hook-form";
import {
  deviceFunctionFormType,
  typeOfEntry,
} from "types/deviceFunctionClientData";

export default function ScaleData(props: {
  setValue: UseFormSetValue<deviceFunctionFormType>;
  typeOfEntry: typeOfEntry;
  isError: boolean;
  isDisabled: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  currentValues: { value: string | number }[];
}) {
  const { fields, append, remove } = useFieldArray({
    name: "scaleData",
  });
  return (
    <>
      <h4 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 lg:text-base">
        Añade tus valores
      </h4>
      <p className="text-sm italic text-lightText dark:text-darkText">
        haz click en el boton de añadir para crear tus opciones
      </p>
      <div className="flex  flex-wrap items-center justify-between gap-1 2xl:w-1/4">
        {fields.map((field, index) => {
          return (
            <div
              className="flex w-[48%] items-center justify-center gap-1"
              key={field.id}
            >
              <Input
                placeholder="valor"
                defaultValue={props.currentValues[index].value}
                onChange={(value) => {
                  let realValue: string | number = "";
                  if (props.typeOfEntry === "STRING") {
                    realValue = value.target.value;
                  } else {
                    if (value.target.value === "") {
                      realValue = "";
                    } else {
                      realValue = Number(value.target.value);
                    }
                  }
                  realValue !== "" && props.setError(false);
                  props.setValue(`scaleData.${index}`, { value: realValue });
                }}
                className="mb-2 block w-4/5 rounded-none border-0 border-b border-lightText/60 bg-transparent px-1 text-xs focus:border-accent focus:ring-0 lg:text-sm dark:border-darkText dark:focus:border-white"
                type={props.typeOfEntry === "STRING" ? "text" : "number"}
              />
              <Cross2Icon
                onClick={() => {
                  remove(index);
                }}
                className="size-4 text-lightText dark:text-darkText"
              />
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => {
          append({ value: "" });
        }}
        className={`flex items-center justify-center gap-2 rounded border p-2 text-sm text-lightText 2xl:w-1/4 dark:text-darkText ${props.isError && "border-danger !text-danger"}`}
        disabled={props.isDisabled}
      >
        {props.isDisabled ? (
          "Completa el valor"
        ) : (
          <>
            <PlusIcon className="size-3 text-lightText dark:text-darkText" />
            Añadir
          </>
        )}
      </button>
    </>
  );
}
