import LoginScreen from "../_components/screens/login-screen"
import { auth } from "~/server/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Check if user is already authenticated
  const session = await auth()

  // If user is already logged in, redirect to home page
  if (session?.user) {
    redirect("/")
  }

  return <LoginScreen />
}

