"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import AppShell from "@/components/app-shell";
import { Loader2 } from "lucide-react";
import { use } from "react";

export default function SwipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { id } = use(params);
  const { data: swipe, isLoading } = api.admin.getSwipeDetail.useQuery({
    swapId: id,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AppShell
      title={`Swipe Details - #${id}`}
      activeScreen="admin"
      showBackButton
      onBack={() => router.back()}
    >
      <div className="p-4">
        <pre className="overflow-auto rounded-lg bg-secondary p-4">
          {JSON.stringify(swipe, null, 2)}
        </pre>
      </div>
    </AppShell>
  );
}
