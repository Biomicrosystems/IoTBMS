import { z } from "zod";

const zodTypeOfFunction = z.enum(["COMMAND", "FREE"], {
  message: "Seleccione el tipo de función",
});
const zodTypeOfEntry = z.enum(["STRING", "NUMBER"], {
  required_error: "Escoja el tipo de función",
});
const zodTypeOfFormat = z.enum(["INTERVAL", "SCALE"]);

export const deviceFunctionForm = z
  .object({
    id: z.string(),
    name: z
      .string()
      .min(2, { message: "El nombre debe tener por lo menos dos caracteres" }),
    description: z.string().min(2, {
      message: "La descripcion debe tener por lo menos dos caracteres",
    }),
    typeOfFunction: zodTypeOfFunction,
    command: z.string(),
    userInfo: z.boolean(),
    userTypeOfEntry: zodTypeOfEntry,
    unit: z.string(),
    format: zodTypeOfFormat,
    maxInterval: z.number(),
    minInterval: z.number(),
    scaleData: z.array(z.object({ value: z.union([z.number(), z.string()]) })),
    message: z.string().optional(),
    sendData: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.typeOfFunction === "FREE" || values.userInfo) {
      if (!values.message || values.message.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 2,
          type: "string",
          message: "El mensaje debe tener por lo menos dos caracteres",
          inclusive: true,
          path: ["message"],
        });
      }
    }

    if (values.typeOfFunction === "COMMAND") {
      if (!values.command || values.command.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: "string",
          message: "El comando debe ser por lo menos 1 caracter",
          inclusive: true,
          path: ["command"],
        });
      }
    }

    if (values.userInfo) {
      if (!values.unit || values.unit.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: "string",
          message: "La unidad debe tener por lo menos un caracter",
          inclusive: true,
          path: ["unit"],
        });
      }
    }
    values.scaleData.forEach((data) => {
      if (data.value.toString().length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: "string",
          message: "Debe haber un valor",
          inclusive: true,
          path: ["scaleData"],
        });
      }
    });
  });

export type deviceFunctionFormType = z.infer<typeof deviceFunctionForm>;
export type typeOfEntry = z.infer<typeof zodTypeOfEntry>;
export type typeOfFormat = z.infer<typeof zodTypeOfFormat>;
export type typeofFunction = z.infer<typeof zodTypeOfFunction>;

export const formSchema = z.object({
  deviceName: z
    .string()
    .min(2, { message: "El nombre debe tener por lo menos 2 caracteres" }),
  deviceDescription: z
    .string()
    .min(2, { message: "La descripcion debe tener por lo menos 2 caracteres" }),
});

export type formSchemaType = z.infer<typeof formSchema>;

// export type deviceFunctionInitialState = {
//   name: string;
//   description: string;
//   typeOfFunction: typeOfEntry;
//   command: string | number;
//   userInfo: boolean;
//   userTypeOfEntry: typeOfEntry | undefined;
//   unit: string | undefined;
//   format: typeOfFormat | undefined;
//   maxInterval: number | undefined;
//   minInterval: number | undefined;
//   scaleData: number[] | undefined;
//   message: string | undefined;
//   sendData: boolean;
// };
