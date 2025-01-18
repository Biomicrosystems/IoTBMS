import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "components/primitives/Form";
import { Input } from "components/primitives/Input";
import { Control } from "react-hook-form";
import { deviceFunctionFormType } from "types/deviceFunctionClientData";

export default function MaxInterval(props: {
  control: Control<deviceFunctionFormType>;
}) {
  return (
    <FormField
      control={props.control}
      name="maxInterval"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-sm lg:text-base">
            Intervalo maximo
          </FormLabel>
          <FormControl>
            <Input
              className="text-sm focus:border-accent lg:text-base dark:bg-dark"
              {...field}
              autoComplete="off"
              type="number"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
