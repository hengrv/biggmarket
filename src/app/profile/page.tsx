import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import ProfilePageComponent from "../_components/profile/profile-page-component";

export default async function Page() {
  const session = await auth();

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }

  // No userId means viewing own profile
  return <ProfilePageComponent />;
}

export const dynamic = "force-dynamic";
