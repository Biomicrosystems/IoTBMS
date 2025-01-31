"use client";
import { Button } from "components/primitives/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/primitives/Dialog";
import { Input } from "components/primitives/Input";
import { Label } from "components/primitives/Label";
import { useState } from "react";

export default function EliminationAlert(props: {
  name: string;
  onSubmitAction: (() => void) | undefined;
  isDevice: boolean;
}) {
  const [labelData, setLabelData] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded border border-danger bg-transparent px-8 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-danger/10">
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            ¿Seguro que quieres eliminar{" "}
            {props.isDevice ? "el dispositivo" : "la función"}?
          </DialogTitle>
          <DialogDescription>
            Escribe "{props.name}" para confirmar
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              placeholder={props.name}
              onChange={(value) => {
                setLabelData(value.target.value);
              }}
              autoComplete="off"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={"destructive"}
              className={`text-white ${labelData !== props.name && "bg-danger/30"}`}
              disabled={labelData !== props.name ? true : false}
              onClick={() => {
                if (props.onSubmitAction !== undefined) {
                  props.onSubmitAction();
                }
              }}
            >
              Borrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
