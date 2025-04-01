import { memo } from "react";
import ItemsSkeleton from "@/components/profile/items-skeleton";
import AppShell from "@/components/app-shell";

function ProfileSkeleton() {
  return (
    <AppShell activeScreen="profile" title="Profile">
      <div className="p-4">
        <div className="mb-6 rounded-lg bg-secondary p-4 shadow-lg">
          <div className="flex items-center">
            <div className="mr-4 h-16 w-16 animate-pulse rounded-full bg-background"></div>
            <div className="flex-1">
              <div className="mb-2 h-5 w-32 animate-pulse rounded bg-background"></div>
              <div className="h-3 w-24 animate-pulse rounded bg-background"></div>
              <div className="mt-1 h-3 w-20 animate-pulse rounded bg-background"></div>
            </div>
            <div className="h-8 w-20 animate-pulse rounded-full bg-background"></div>
          </div>

          <div className="mt-4 flex justify-around border-t border-background pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="mb-1 h-8 w-8 animate-pulse rounded-full bg-background"></div>
                <div className="h-3 w-16 animate-pulse rounded bg-background"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 flex rounded-lg bg-secondary p-1 shadow-lg">
          <div className="flex-1 py-2"></div>
          <div className="flex-1 py-2"></div>
        </div>

        <ItemsSkeleton />
      </div>
    </AppShell>
  );
}

export default memo(ProfileSkeleton);
