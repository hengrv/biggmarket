import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-bm-green" />
      <p className="animate-pulse text-bm-white">Loading...</p>
    </div>
  );
}
