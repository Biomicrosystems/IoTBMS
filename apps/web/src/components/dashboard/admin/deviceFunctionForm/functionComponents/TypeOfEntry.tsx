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

export default function TypeOfEntry() {
  return (
    <FormField
      name="userTypeOfEntry"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm lg:text-base">
            Tipo de entrada
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="data-[state=open]:border-accent">
                <SelectValue placeholder="Selecciona un tipo de entrada" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-dark">
                <SelectItem
                  className="focus:bg-black/10 dark:focus:bg-white/10"
                  value="NUMBER"
                >
                  Numerica
                </SelectItem>
                <SelectItem
                  className="focus:bg-black/10 dark:focus:bg-white/10"
                  value="STRING"
                >
                  Texto
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
