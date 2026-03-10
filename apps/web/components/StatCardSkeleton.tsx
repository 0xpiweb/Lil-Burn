"use client";

import { GrungeCard } from "@/components/GrungeCard";
import { HEIGHT } from "./StatCard";

export function StatCardSkeleton() {
  return (
    <GrungeCard
      className="flex flex-col items-center justify-center gap-2 rounded-sm px-5 py-6"
      style={{ height: HEIGHT }}
    >
      <div className="h-5 w-16 animate-pulse rounded bg-zinc-700/60" />
      <div className="h-3 w-20 animate-pulse rounded bg-zinc-800/80" />
    </GrungeCard>
  );
}
