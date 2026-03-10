"use client";

import { GrungeCard } from "./GrungeCard";
import { HEIGHT } from "./MintPhaseCard";

export function MintPhaseCardsSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <GrungeCard
          key={i}
          className="relative flex flex-1 flex-col items-center gap-3 rounded-sm p-6"
          style={{ height: HEIGHT }}
        >
          <span className="absolute -top-2.5 -right-2.5 size-6 animate-pulse rounded-sm bg-zinc-800" />
          <div className="size-10 shrink-0 animate-pulse rounded bg-zinc-800" />
          <div className="h-6 w-24 animate-pulse rounded bg-zinc-700/60" />
          <div className="h-3 w-32 animate-pulse rounded bg-zinc-800/80" />

          <div className="grow"></div>
          <div className="h-3 w-16 animate-pulse rounded bg-zinc-800/60" />
        </GrungeCard>
      ))}
    </div>
  );
}
