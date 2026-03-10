"use client";

import { GrungeCard } from "./GrungeCard";
import { HEIGHT } from "./MintControls";

export function MintControlsSkeleton() {
  return (
    <GrungeCard
      className="flex w-full flex-col gap-5 rounded p-6"
      style={{ height: HEIGHT }}
    >
      <div className="flex flex-col gap-2">
        <div className="h-5 w-16 animate-pulse rounded bg-zinc-700" />

        <div className="flex items-center gap-2">
          <div className="h-10 w-10 animate-pulse rounded bg-zinc-700" />
          <div className="h-10 flex-1 animate-pulse rounded-sm bg-zinc-800" />
          <div className="h-10 w-10 animate-pulse rounded bg-zinc-700" />
        </div>

        <div className="h-4.25 w-32 animate-pulse rounded bg-zinc-800" />
      </div>

      <div className="flex flex-col divide-y divide-zinc-700/50 rounded-sm border border-zinc-700/50 bg-zinc-800/50">
        <div className="flex h-11.25 items-center justify-between px-5">
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-700" />
          <div className="h-5 w-20 animate-pulse rounded bg-zinc-700" />
        </div>
        <div className="flex h-13 items-center justify-between px-5">
          <div className="h-5 w-20 animate-pulse rounded bg-zinc-700" />
          <div className="h-6.75 w-28 animate-pulse rounded bg-zinc-700" />
        </div>
      </div>

      <div className="h-15 w-full animate-pulse rounded bg-zinc-700" />
    </GrungeCard>
  );
}
