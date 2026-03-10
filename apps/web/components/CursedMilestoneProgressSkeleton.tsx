"use client";

import { HEIGHT } from "./CursedMilestoneProgress";

export function CursedMilestoneProgressSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2" style={{ height: HEIGHT }}>
      <div className="flex items-center justify-between">
        <div className="h-5 w-80 animate-pulse rounded bg-zinc-700/60" />
        <div className="h-5 w-16 animate-pulse rounded bg-zinc-800/80" />
      </div>

      <div className="w-full rounded-full bg-zinc-800">
        <div className="h-1.5 w-0 rounded-full bg-zinc-700" />
      </div>
    </div>
  );
}
