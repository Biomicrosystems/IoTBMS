import logo from "img/Logo.png";
import Link from "next/link";
import Image from "next/image";
import heroImage from "img/HeroImage.jpg";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="lg flex h-screen w-full flex-col justify-center px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-0">
      <div className=" flex w-full flex-col lg:items-center">
        <div className="flex flex-col gap-4 lg:w-500px">
          <span className="mb-8 flex flex-col items-center justify-center">
            <Image
              src={logo}
              alt="Logo"
              className="h-10 w-12 lg:h-14 lg:w-16"
            />
            <p className="ml-2 text-xl font-medium lg:text-4xl">Conection</p>
          </span>

          {children}

          <span className="border  border-lightText/30 dark:border-darkText/30" />
          <Link
            href="/"
            className=" flex w-full items-center justify-center gap-2 rounded border border-lightText bg-transparent py-2 text-center text-xs text-lightText lg:text-sm  dark:border-darkText dark:text-darkText"
          >
            <ArrowLeftIcon className="size-4 text-lightText dark:text-darkText" />
            Volver
          </Link>
        </div>
      </div>
      <div className="hidden lg:flex">
        <Image src={heroImage} alt="" className="h-screen" />
      </div>
    </main>
  );
}
