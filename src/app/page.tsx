import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import LoginScreen from "./_components/screens/login-screen";

import HomeScreen from "./_components/screens/home-screen";
export default async function Home() {
  const session = await auth();

  if (session?.user) {
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background-1 text-text-1">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {session?.user ? <HomeScreen /> : <LoginScreen />}
        </div>
      </main>
    </HydrateClient>
  );
}
