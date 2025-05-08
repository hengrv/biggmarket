"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import AppShell from "@components/app-shell";
import { matchedStatus } from "@prisma/client";
import MatchSuccessModal from "@components/MatchSuccessModal";

export default function SwapDetails({
  params,
}: {
  params: Promise<{ matchid: string }>;
}) {
  const { matchid } = use(params);
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: userId } = api.user.getCurrentlyAuthenticatedUser.useQuery();
  const { data: matches, isLoading: matchesLoading } =
    api.item.getMatches.useQuery({ userId });

  const acceptMatchMutation = api.item.acceptMatch.useMutation({
    onSuccess: () => {
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    },
  });

  const rejectMatchMutation = api.item.rejectMatch.useMutation({
    onSuccess: () => {
      router.push("/swap");
    },
  });

  if (matchesLoading) {
    return (
      <AppShell
        title="Match Detail"
        showBackButton={true}
        onBack={() => router.back()}
      >
        <div className="flex h-full items-center justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c1ff72] border-t-transparent"></div>
        </div>
      </AppShell>
    );
  }

  const match = matches?.filter((match) => match.id === matchid)[0];

  if (!match) {
    router.push("/swap");
    return null;
  }

  return (
    <AppShell
      title="Match Detail"
      showBackButton={true}
      onBack={() => router.back()}
    >
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h2 className="mb-2 text-lg font-semibold">
              {match.user1Id === userId ? `Your Item` : `Their Item`}
            </h2>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={match.useritem1.images[0] ?? "/item-placeholder.svg"}
                alt={match.useritem1.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-sm">{match.useritem1.title}</p>
            <p className="mt-2 text-sm">{match.useritem1.description}</p>
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-lg font-semibold">
              {match.user2Id === userId ? `Your Item` : `Their Item`}
            </h2>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={match.useritem2.images[0] ?? "/item-placeholder.svg"}
                alt={match.useritem2.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-sm">{match.useritem2.title}</p>
            <p className="mt-2 text-sm">{match.useritem2.description}</p>
          </div>
        </div>
        {match.status === matchedStatus.PENDING ? (
          <>
            <button
              onClick={() => acceptMatchMutation.mutate({ matchId: matchid })}
              className="w-full rounded-lg bg-bm-green py-3 font-semibold text-bm-black transition-all duration-300 hover:bg-bm-green/70"
            >
              Accept Match
            </button>
            <button
              onClick={() => rejectMatchMutation.mutate({ matchId: matchid })}
              className="w-full rounded-lg bg-error py-3 font-semibold text-bm-black transition-all duration-300 hover:bg-error/70"
            >
              Decline Match
            </button>
          </>
        ) : match.status === matchedStatus.ACCEPTED ? (
          <div className="flex w-full items-center justify-center bg-bm-green py-3 font-semibold text-bm-black">
            Match Made!
          </div>
        ) : (
          <div className="flex w-full items-center justify-center bg-error py-3 font-semibold text-bm-black">
            Match Rejected!
          </div>
        )}
      </div>
      <MatchSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </AppShell>
  );
}
