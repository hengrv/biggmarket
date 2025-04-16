import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import ItemDetailPage from "./item-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const session = await auth();

  const { itemId } = await params;

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <ItemDetailPage itemId={itemId} />
    </HydrateClient>
  );
}

export const dynamic = "force-dynamic";
