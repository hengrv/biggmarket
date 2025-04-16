import { auth } from "~/server/auth"
import { redirect } from "next/navigation"
import FeedPage from "@screens/feed-page"
import { HydrateClient } from "~/trpc/server"

export default async function Page() {
  const session = await auth()

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <HydrateClient>
      <FeedPage />
    </HydrateClient>
  )
}

