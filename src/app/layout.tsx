import "~/styles/globals.css";

import { Rubik_Distressed } from "next/font/google";
import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "biggmarket",
  description: "biggmarket",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const rubik = Rubik_Distressed({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${rubik.variable}`}>
      <head></head>
      <body suppressHydrationWarning>
        <TRPCReactProvider>
          <div className="relative mx-auto min-h-screen min-w-full max-w-md overflow-hidden bg-background-1">
            <main className="mx-auto flex min-h-screen flex-col items-center justify-center bg-background-1 text-text-1">
              <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 lg:py-16">
                {children}
              </div>
            </main>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
