"use client";

import { Loader2, ChevronRight, AlertTriangle } from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { matchedStatus } from "@prisma/client";

export default function SwapHistoryPage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const router = useRouter();

  const { userid } = use(params);

  // Fetch user's matches for the specific user
  const { data: matches, isLoading } = api.item.getMatches.useQuery(
    { userId: userid },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();

  let filter: matchedStatus[];
  if (userid === currentUserId) {
    filter = [
      matchedStatus.ACCEPTED,
      matchedStatus.PENDING,
      matchedStatus.REJECTED,
    ];
  } else {
    filter = [matchedStatus.ACCEPTED];
  }

  return (
    <AppShell
      title="Swaps History"
      showBackButton={true}
      onBack={() => router.back()}
      activeScreen="swap"
    >
      <div className="p-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches
              .filter((match) => filter.includes(match.status))
              .map((match) => (
                <div
                  key={match.id}
                  className="flex cursor-pointer items-center rounded-lg bg-secondary p-4 shadow-lg transition-colors hover:bg-[#2a2a2a]"
                  onClick={() => {
                    alert(`Viewing details for match ${match.id}`);
                  }}
                >
                  <div className="mr-4 h-16 w-16 overflow-hidden rounded-lg">
                    <Image
                      src={
                        match.useritem1.images[0] ??
                        "/item-placeholder.svg?height=64&width=64"
                      }
                      alt={match.useritem1.title ?? "Item"}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {match.useritem1.title ??
                        match.useritem1.description?.substring(0, 20) ??
                        "Item"}
                    </div>
                    <div className="text-xs text-muted">
                      Swapped with {match.useritem2.user.name ?? "User"}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </div>
                    <div
                      className={`mt-1 text-xs ${
                        match.status === "ACCEPTED"
                          ? "text-bm-green"
                          : match.status === "REJECTED"
                            ? "text-red-400"
                            : "text-yellow-400"
                      } font-medium`}
                    >
                      {match.status}
                    </div>
                  </div>

                  <button className="rounded-full bg-background p-2">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <AlertTriangle className="mb-2 h-10 w-10 text-primary" />
            <h3 className="mb-2 font-semibold text-foreground">No Swaps Yet</h3>
            <p className="text-sm text-muted">No swaps found for this user.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
