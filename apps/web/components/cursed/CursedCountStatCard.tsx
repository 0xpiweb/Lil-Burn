"use client";

import { StatCard } from "@/components/ui/StatCard";
import { StatCardSkeleton } from "@/components/ui/StatCardSkeleton";
import { useCursedStats } from "@/hooks/queries/useCursedStats";

export function CursedCountStatCard() {
  const { data, isSuccess } = useCursedStats();

  if (!isSuccess) {
    return <StatCardSkeleton />;
  }

  return <StatCard value={data.total} label="Cursed Revealed" />;
}
