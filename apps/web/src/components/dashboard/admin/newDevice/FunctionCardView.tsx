import { PencilSquare } from "components/icons/PencilSquare";
import type { Dispatch, SetStateAction } from "react";

export default function FunctionCardView(props: {
  name: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setFunctionId: Dispatch<SetStateAction<string>>;
  functionId: string;
}) {
  return (
    <div
      className="relative w-full cursor-pointer rounded border border-lightText bg-white py-2 text-center align-middle text-sm text-lightText dark:border-darkText dark:bg-dark dark:text-darkText"
      onClick={() => {
        props.setIsEditing(true);
        props.setFunctionId(props.functionId);
      }}
    >
      <h3>{props.name}</h3>
      <PencilSquare className="absolute right-3 top-2 size-5 stroke-lightText dark:stroke-darkText" />
    </div>
  );
}
