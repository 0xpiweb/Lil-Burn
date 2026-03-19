"use client";

import { StatCard } from "@/components/ui/StatCard";
import { StatCardSkeleton } from "@/components/ui/StatCardSkeleton";
import { useLilBurnBurnCount } from "@/hooks/queries/useLilBurnBurnCount";

export function YieldBurnCountStatCard() {
  const { data, isSuccess } = useLilBurnBurnCount();

  if (!isSuccess) {
    return <StatCardSkeleton />;
  }

  return <StatCard value={data} label="Lil-B Burned" />;
}
