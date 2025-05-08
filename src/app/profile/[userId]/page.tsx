// Update the page component to use the combined ProfilePageComponent
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import ProfilePageComponent from "@components/profile/profile-page-component";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();

  const { userId } = await params;

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }

  return <ProfilePageComponent userId={userId} />;
}

export const dynamic = "force-dynamic";
