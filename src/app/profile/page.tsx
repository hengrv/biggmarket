import { auth } from "~/server/auth"
import { redirect } from "next/navigation"
import ProfilePage from "./profile-page-component"

export default async function Page() {
  const session = await auth()

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login")
  }

  return <ProfilePage />
}

export const dynamic = "force-dynamic"

