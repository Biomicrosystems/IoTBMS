import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "components/primitives/Form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "components/primitives/Select";
import { Control } from "react-hook-form";
import { deviceFunctionFormType } from "types/deviceFunctionClientData";

export default function Format(props: {
  isText: boolean;
  control: Control<deviceFunctionFormType>;
}) {
  return (
    <FormField
      name="format"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm lg:text-base">Formato</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="data-[state=open]:border-accent">
                <SelectValue placeholder="Selecciona un formato" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-dark">
                <SelectItem
                  className="focus:bg-black/10 dark:focus:bg-white/10"
                  value="SCALE"
                >
                  Escala
                </SelectItem>
                {!props.isText && (
                  <SelectItem
                    className="focus:bg-black/10 dark:focus:bg-white/10"
                    value="INTERVAL"
                  >
                    Intervalo
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
