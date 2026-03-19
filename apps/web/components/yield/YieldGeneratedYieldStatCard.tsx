"use client";

import { StatCard } from "@/components/ui/StatCard";
import { StatCardSkeleton } from "@/components/ui/StatCardSkeleton";
import { useYieldGeneratedYield } from "@/hooks/queries/useYieldGeneratedYield";

export function YieldGeneratedYieldStatCard() {
  const { data, isSuccess } = useYieldGeneratedYield();

  if (!isSuccess) {
    return <StatCardSkeleton />;
  }

  return <StatCard value={data} unit="$AVAX" label="Total Yield" />;
}
