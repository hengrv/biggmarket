import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { ProfileTester } from "~/app/_components/profiletest";
import ItemTester from "@components/itemtest";
import { ReviewTester } from "./_components/reviewtest";
import { LocationTester } from "./_components/locationtest";
import { ViewItemsTester } from "./_components/viewitemstest";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white"></p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
          {session?.user && <ItemTester />}
          {session?.user && <ProfileTester />}
          {session?.user && <ReviewTester />}
          {session?.user && <LocationTester />}
          {session?.user && <ViewItemsTester />}
        </div>
      </main>
    </HydrateClient>
  );
}
