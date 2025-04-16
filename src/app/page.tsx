import { auth } from "~/server/auth"
import { redirect } from "next/navigation"
import { HydrateClient } from "~/trpc/server"
import HomeScreen from "./_components/screens/home-screen"

export default async function Home() {
  const session = await auth()

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background-1 text-text-1">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <HomeScreen />
        </div>
      </main>
    </HydrateClient>
  )
}
