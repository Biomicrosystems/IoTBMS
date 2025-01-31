"use client";

import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/primitives/DropdownMenu";

import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden lg:block">
        {resolvedTheme === "light" ? (
          <SunIcon className="size-6 text-lightText dark:text-darkText" />
        ) : (
          <MoonIcon className="size-6 text-lightText dark:text-darkText " />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="animate-openMenu bg-white dark:bg-dark"
      >
        <DropdownMenuItem
          className="flex  items-center gap-2 px-2 py-1 text-sm text-lightText focus:bg-black/10 dark:text-darkText dark:focus:bg-white/10"
          onSelect={() => setTheme("light")}
        >
          <SunIcon className="size-5 text-lightText dark:text-darkText " />
          Modo claro
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex  items-center gap-2 px-2 py-1 text-sm text-lightText focus:bg-black/10 dark:text-darkText dark:focus:bg-white/10"
          onSelect={() => setTheme("dark")}
        >
          <MoonIcon className="size-5 text-lightText dark:text-darkText" />
          Modo Oscuro
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex  items-center gap-2 px-2 py-1 text-sm text-lightText focus:bg-black/10 dark:text-darkText dark:focus:bg-white/10"
          onSelect={() => setTheme("system")}
        >
          <DesktopIcon className="size-5 text-lightText dark:text-darkText " />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
