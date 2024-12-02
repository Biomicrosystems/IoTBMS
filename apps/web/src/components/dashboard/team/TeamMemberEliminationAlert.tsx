"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
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
import { useToast } from "components/primitives/useToast";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";

export default function TeamMemberEliminationAlert(props: {
  name: string;
  teamId: Id<"team">;
  isPending: boolean;
}) {
  const { toast } = useToast();
  const deleteTeamMember = useMutation(api.team.removeUserFromTeam);
  const deleteMemberInvitation = useMutation(
    api.invitations.deleteInvitationByUserName,
  );
  const [labelData, setLabelData] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ExclamationTriangleIcon className="size-5 cursor-pointer text-danger" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            ¿Quieres eliminar a este usuario del equipo?
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
              onClick={async () => {
                if (props.isPending) {
                  const res = await deleteMemberInvitation({
                    teamId: props.teamId,
                    userName: props.name,
                  });
                  if (res) {
                    toast({
                      title: "Usuario eliminado del equipo",
                      variant: "success",
                    });
                  } else {
                    toast({
                      title: "Algo salio mal vuelve a intentarlo más tarde",
                      variant: "destructive",
                    });
                  }
                } else {
                  const res = await deleteTeamMember({
                    teamId: props.teamId,
                    userName: props.name,
                  });
                  if (res) {
                    toast({
                      title: "Usuario Eliminado del equipo",
                      variant: "success",
                    });
                  } else {
                    toast({
                      title: "Algo salio mal vuelve a intentarlo más tarde",
                      variant: "destructive",
                    });
                  }
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
