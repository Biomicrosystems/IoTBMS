"use client";

import { useTheme } from "next-themes";

import { useEffect, useState } from "react";
import { CaretSortIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function MobileThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 lg:hidden">
      <span>
        {resolvedTheme === "light" ? (
          <SunIcon className="size-5 text-lightText dark:text-darkText" />
        ) : (
          <MoonIcon className="size-5 text-lightText dark:text-darkText" />
        )}
      </span>
      <select
        className="border-0 bg-none p-0 text-sm text-lightText focus:border-none focus:outline-none focus:ring-0 dark:bg-dark dark:text-darkText "
        value={resolvedTheme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">Modo claro</option>
        <option value="dark">Modo oscuro</option>
        <option value="system">Sistema</option>
      </select>
      <span>
        <CaretSortIcon className="size-5 text-lightText dark:text-darkText" />
      </span>
    </div>
  );
}
