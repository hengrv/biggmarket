"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import AppShell from "@/components/app-shell";
import { Loader2, UserX } from "lucide-react";
import { use, useState } from "react";

export default function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [showBanConfirmation, setShowBanConfirmation] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  const { id } = use(params);
  const { data: user, isLoading } = api.admin.getUserDetail.useQuery({
    userId: id,
  });

  // Get current user to check if admin is trying to ban themselves
  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();

  // Delete user mutation (used for banning)
  const deleteUserMutation = api.user.deleteUser.useMutation({
    onSuccess: () => {
      setIsBanning(false);
      router.push("/admin");
    },
    onError: (error) => {
      setIsBanning(false);
      alert(`Error banning user: ${error.message}`);
    },
  });

  const handleBanUser = () => {
    if (id === currentUserId) {
      alert("You cannot ban yourself!");
      return;
    }

    setIsBanning(true);
    deleteUserMutation.mutate({ userId: id });
  };

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
        {/* Ban User Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowBanConfirmation(true)}
            disabled={id === currentUserId || isBanning}
            className={`flex items-center rounded-lg ${id === currentUserId
                ? "cursor-not-allowed bg-gray-500"
                : "bg-error hover:bg-red-700"
              } px-4 py-2 text-bm-black transition-colors`}
          >
            <UserX className="mr-2 h-5 w-5" />
            {isBanning ? "Banning..." : "Ban User"}
          </button>
          {id === currentUserId && (
            <p className="mt-1 text-xs text-red-400">You cannot ban yourself</p>
          )}
        </div>

        {/* Ban Confirmation Modal */}
        {showBanConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-background p-6">
              <h3 className="mb-4 text-lg font-bold text-red-500">
                Ban User Confirmation
              </h3>
              <p className="mb-4 text-foreground">
                Are you sure you want to ban{" "}
                {user?.name ?? user?.email ?? "this user"}? This action will
                delete their account and cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowBanConfirmation(false)}
                  className="rounded-lg bg-secondary px-4 py-2 text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanUser}
                  disabled={isBanning}
                  className="rounded-lg bg-error px-4 py-2 text-bm-black hover:bg-red-700"
                >
                  {isBanning ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Confirm Ban"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details */}
        <pre className="overflow-auto rounded-lg bg-secondary p-4">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </AppShell>
  );
}
