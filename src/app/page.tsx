import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import HomeScreen from "./_components/screens/home-screen";

export default async function Home() {
  const session = await auth();

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <HomeScreen />
    </HydrateClient>
  );
}
