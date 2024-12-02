"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "components/primitives/Form";
import { useToast } from "components/primitives/useToast";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateNewTeam(props: {
  setIsCreatingTeam: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const [test, setTest] = useState(false);
  useEffect(() => {
    console.log(test);
  }, [test]);
  const createTeam = useMutation(api.team.createTeam);
  const formSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(3),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <span
      className={`fixed left-0 top-0  z-10 flex h-screen w-screen items-center justify-center bg-black/15 px-4 transition-all dark:bg-black/65`}
    >
      <div className="flex h-fit w-screen flex-col  rounded-lg bg-white px-5 py-8 lg:w-500px dark:bg-dark">
        <p className="mb-4 text-sm ">Crea un nuevo equipo</p>
        <Form {...form}>
          <form
            className="relative mb-8 flex w-full flex-col gap-4 "
            onSubmit={form.handleSubmit(
              async (data) => {
                const res = await createTeam({
                  name: data.name,
                  description: data.description,
                });
                if (res) {
                  toast({
                    title: "El equipo se ha creado con exito",
                    description: `Se ha cambiado tu equipo activo por ${data.name}`,
                    variant: "success",
                  });
                  setTest(true);
                  props.setIsCreatingTeam(false);
                } else {
                  props.setIsCreatingTeam(false);
                }
              },
              (errors) => console.log(errors),
            )}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...field}
                      className="w-full rounded-md dark:bg-dark dark:text-white"
                      placeholder="Nombre del equipo"
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...field}
                      className="w-full rounded-md dark:bg-dark dark:text-white"
                      placeholder="description del equipo"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="mt-4 h-10 w-full rounded bg-accent p-2 text-sm text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:text-zinc-100 dark:disabled:bg-indigo-400"
              disabled={!form.formState.isValid}
            >
              Crear equipo
            </button>
            <button
              type="button"
              onClick={() => {
                props.setIsCreatingTeam(false);
              }}
              className="h-10 w-full rounded-sm border border-danger p-2 text-sm text-danger transition hover:bg-red-50 dark:hover:bg-danger/10 "
            >
              Cancelar
            </button>
          </form>
        </Form>
      </div>
    </span>
  );
}
