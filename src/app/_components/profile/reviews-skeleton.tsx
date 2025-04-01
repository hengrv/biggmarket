import { memo } from "react";

function ReviewsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-lg bg-secondary p-4 shadow-lg">
          <div className="mb-2 flex items-center">
            <div className="mr-3 h-10 w-10 animate-pulse rounded-full bg-background"></div>
            <div className="flex-1">
              <div className="mb-1 h-4 w-24 animate-pulse rounded bg-background"></div>
              <div className="h-3 w-32 animate-pulse rounded bg-background"></div>
            </div>
          </div>
          <div className="h-12 w-full animate-pulse rounded bg-background"></div>
        </div>
      ))}
    </div>
  );
}

export default memo(ReviewsSkeleton);
