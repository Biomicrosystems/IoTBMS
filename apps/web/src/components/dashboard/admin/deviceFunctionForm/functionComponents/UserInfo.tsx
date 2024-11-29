import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "components/primitives/Form";
import { Switch } from "components/primitives/Switch";
import { Control } from "react-hook-form";
import { deviceFunctionFormType } from "types/deviceFunctionClientData";

export default function UserInfo(props: {
  control: Control<deviceFunctionFormType>;
}) {
  return (
    <FormField
      control={props.control}
      name="userInfo"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-lg border p-2 lg:w-1/2">
          <FormLabel className="text-xs lg:text-sm">
            ¿Deseas recibir información del usuario para ejecutar la función?
          </FormLabel>

          <FormControl>
            <Switch
              className="m-0"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
