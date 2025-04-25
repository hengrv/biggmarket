import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
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
      <head>
      </head>
      <body suppressHydrationWarning>
        <TRPCReactProvider>
          <div className="relative mx-auto min-h-screen max-w-md overflow-hidden bg-background-1">
            {children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
