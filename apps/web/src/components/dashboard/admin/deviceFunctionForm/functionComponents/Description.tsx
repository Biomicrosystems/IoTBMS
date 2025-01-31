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

export default function Description(props: {
  control: Control<deviceFunctionFormType>;
}) {
  return (
    <FormField
      control={props.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm lg:text-base">
            Descripción de la función
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
