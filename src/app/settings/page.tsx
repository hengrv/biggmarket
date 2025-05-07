"use client";
import { api } from "~/trpc/react";
import AppShell from "@/components/app-shell";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const deleteMutation = api.user.deleteUser.useMutation();
  const { data: userId } = api.user.getCurrentlyAuthenticatedUser.useQuery();
  const [showModel, setShowModal] = useState<boolean>(true);
  const router = useRouter();

  const openDeleteModal = () => {
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    await deleteMutation.mutateAsync({ userId });
    router.push("/");
  };

  return (
    <>
      <AppShell title={"Settings Page"}>
        <div className="min-h-full p-4 text-bm-white">
          <div className="mb-6 rounded-lg bg-secondary p-4 shadow-lg">
            <div className="">
              <button
                className={"rounded-lg bg-zinc-800 p-2"}
                onClick={openDeleteModal}
              >
                Delete my Account
              </button>
              {showModel && (
                <div className="justify-left items-center rounded-lg bg-zinc-800 p-3 transition-opacity duration-300">
                  <h1 className="pb-3 text-error">
                    Account Deletion Confirmation !
                  </h1>
                  <h2 className="pb-3 text-sm text-bm-white/90">
                    Are you sure you want to delete your account?
                  </h2>
                  <h3 className="pb-3 text-xs text-bm-white/90">
                    This action is irreversable.
                  </h3>
                  <div className="flex flex-row items-center justify-center space-x-10">
                    <button
                      className="bg-bm-green px-2 py-1 text-bm-black"
                      onClick={() => setShowModal(false)}
                    >
                      Go Back!
                    </button>
                    <button
                      className="bg-error px-2 py-1 text-bm-black"
                      onClick={handleDeleteUser}
                    >
                      Delete my Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
