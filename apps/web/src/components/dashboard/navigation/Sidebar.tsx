"use client";

import MenuContent from "./MenuContent";

export default function Sidebar(props: { isAdmin: boolean }) {
  return (
    <nav className="hidden w-75vw flex-col gap-2 bg-white pb-4 text-sm transition-all lg:flex lg:h-screen lg:w-64 lg:border-r lg:text-base dark:bg-dark lg:dark:border-r-neutral-700">
      <MenuContent isAdmin={props.isAdmin} />
    </nav>
  );
}
