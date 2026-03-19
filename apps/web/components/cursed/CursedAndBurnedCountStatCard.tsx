"use client";

import { StatCard } from "@/components/ui/StatCard";
import { StatCardSkeleton } from "@/components/ui/StatCardSkeleton";
import { useCursedStats } from "@/hooks/queries/useCursedStats";

export function CursedAndBurnedCountStatCard() {
  const { data, isSuccess } = useCursedStats();

  if (!isSuccess) {
    return <StatCardSkeleton />;
  }

  return <StatCard value={data.cursedAndBurned} label="Cursed & Burned" />;
}
