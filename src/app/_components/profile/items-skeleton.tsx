import { memo } from "react";

function ItemsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg bg-secondary shadow-lg"
        >
          <div className="h-32 w-full animate-pulse bg-bm-black transition-opacity duration-300"></div>
          <div className="p-2">
            <div className="mb-1 h-4 w-full animate-pulse rounded bg-background"></div>
            <div className="h-3 w-20 animate-pulse rounded bg-background"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(ItemsSkeleton);
