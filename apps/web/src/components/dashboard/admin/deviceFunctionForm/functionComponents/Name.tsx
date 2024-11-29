import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/primitives/Form";
import { Input } from "components/primitives/Input";
import { Control } from "react-hook-form";
import type { deviceFunctionFormType } from "types/deviceFunctionClientData";

export default function Name(props: {
  control: Control<deviceFunctionFormType>;
}) {
  return (
    <FormField
      control={props.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm lg:text-base">
            Nombre de la funcion
          </FormLabel>
          <FormControl>
            <Input
              className="text-sm focus:border-accent lg:text-base dark:bg-dark"
              {...field}
              autoComplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
