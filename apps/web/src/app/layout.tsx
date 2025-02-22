import "./globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import ThemesProvider from "./ThemesProvider";
import { Providers } from "./providers";
import { Toaster } from "components/primitives/Toaster";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <body className={dmSans.className}>
          <ThemesProvider>
            <Toaster />
            {children}
          </ThemesProvider>
        </body>
      </html>
    </Providers>
  );
}
