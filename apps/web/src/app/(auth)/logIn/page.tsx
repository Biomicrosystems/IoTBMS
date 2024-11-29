import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LogIn() {
  return (
    <>
      <h1 className="mb-4 text-center text-3xl font-medium lg:text-4xl">
        Iniciar sesión
      </h1>
      <SignIn
        afterSignInUrl="/selectTeam"
        appearance={{
          elements: {
            rootBox: "w-full",
            formButtonPrimary: "bg-accent",
            headerSubtitle: "hidden",
            header: "hidden",
            card: "shadow-none bg-transparent p-0 m-0 w-full ",
            headerTitle: "hidden",
            footer: "hidden",
            formFieldInput:
              "border-lightText dark:border-darkText rounded-sm bg-transparent dark:text-white",
            formFieldLabel: "text-black dark:text-white lg:text-base",
            identityPreviewText: "dark:text-black",
            identityPreview: "dark:bg-neutral-400 bg-neutral-100",
          },
        }}
      />
      <span className=" flex items-center gap-2">
        <p className="text-xs font-medium text-lightText lg:text-sm dark:text-darkText">
          ¿No tienes cuenta?
        </p>
        <Link
          href="/signUp"
          className="text-xs font-medium text-accent lg:text-sm"
        >
          Registrate
        </Link>
      </span>
    </>
  );
}
