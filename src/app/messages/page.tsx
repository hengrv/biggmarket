import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import MessagesPage from "~/app/_components/screens/messages-page";
import { HydrateClient } from "~/trpc/server";

export default async function Page() {
  const session = await auth();

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <MessagesPage />
    </HydrateClient>
  );
}
