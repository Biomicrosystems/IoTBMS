import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/primitives/Form";
import { Textarea } from "components/primitives/TextArea";
import { Control } from "react-hook-form";
import { deviceFunctionFormType } from "types/deviceFunctionClientData";

export default function Message(props: {
  control: Control<deviceFunctionFormType>;
}) {
  return (
    <FormField
      control={props.control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm lg:text-base">
            Escribe un mensaje para el usuario
          </FormLabel>
          <FormControl>
            <Textarea
              className="text-sm focus:border-accent lg:text-base dark:bg-dark"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
