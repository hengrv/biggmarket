"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import AppShell from "@/components/app-shell";
import { Loader2 } from "lucide-react";

export default function UserDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: user, isLoading } = api.admin.getUserDetail.useQuery({
    userId: params.id,
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
      title={`User Details - ${user?.name ?? "Loading..."}`}
      activeScreen="admin"
      showBackButton
      onBack={() => router.back()}
    >
      <div className="p-4">
        <pre className="overflow-auto rounded-lg bg-secondary p-4">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </AppShell>
  );
}
