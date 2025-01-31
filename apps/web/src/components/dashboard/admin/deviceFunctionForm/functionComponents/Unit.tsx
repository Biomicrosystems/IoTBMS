import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/primitives/Form";
import { Input } from "components/primitives/Input";
import { Control } from "react-hook-form";
import { deviceFunctionFormType } from "types/deviceFunctionClientData";

export default function Unit(props: {
  control: Control<deviceFunctionFormType>;
}) {
  return (
    <FormField
      control={props.control}
      name="unit"
      render={({ field }) => (
        <FormItem className="lg:w-1/2">
          <FormLabel className="text-sm lg:text-base">Unidad</FormLabel>
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
