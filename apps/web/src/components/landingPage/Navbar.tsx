"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "img/Logo.png";

import MobileThemeSwitch from "components/common/MobileThemeSwitch";
import ThemeSwitch from "components/common/ThemeSwitch";

import { useState } from "react";

import type { Dispatch, SetStateAction } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="flex w-full items-center justify-between px-4 py-3 lg:px-20 lg:py-4">
      <div className="flex items-center justify-center gap-4">
        <span
          onClick={() => router.push("/")}
          className="flex items-center justify-center"
        >
          <Image src={logo} alt="Logo" className="h-7 w-9 lg:h-10 lg:w-12" />
          <p className="ml-2 text-xs font-bold lg:text-base">Conection</p>
        </span>
        <Link
          href="/"
          className="hidden text-sm text-lightText lg:block dark:text-darkText"
        >
          Documentación
        </Link>
      </div>
      <div className="flex items-center justify-center gap-4">
        <span
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <HamburgerMenuIcon className="size-6 fill-lightText stroke-[0px] lg:hidden dark:fill-darkText" />
        </span>

        <ThemeSwitch />

        <button
          className="hidden text-sm font-bold lg:block dark:border-darkText"
          onClick={() => router.push("/logIn")}
        >
          Inicia sesión
        </button>

        <button
          className="hidden w-40 rounded bg-accent py-2 text-sm text-white lg:block"
          onClick={() => router.push("/signUp")}
        >
          Crea tu cuenta
        </button>
      </div>
      {isOpen ? <MobileMenu setOpen={setIsOpen} router={router} /> : <></>}
    </nav>
  );
}

function MobileMenu(props: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
}) {
  return (
    <div className="fixed right-0 top-0 z-10 flex h-screen w-screen flex-col gap-4 bg-white px-4 py-3 dark:bg-dark">
      <span onClick={() => props.setOpen(false)} className="self-end">
        <Cross2Icon className="size-6 fill-lightText stroke-0 dark:fill-darkText" />
      </span>
      <button
        className="w-full rounded border border-lightText   py-2 text-sm dark:border-darkText"
        onClick={() => props.router.push("/logIn")}
      >
        Inicia sesión
      </button>
      <button
        className="w-full rounded bg-accent py-2 text-sm text-white"
        onClick={() => props.router.push("/signUp")}
      >
        Crea una cuenta
      </button>
      <span className="border border-lightText/30 dark:border-darkText/30" />
      <a className="text-sm text-lightText dark:text-darkText">Documentación</a>
      <MobileThemeSwitch />
    </div>
  );
}
