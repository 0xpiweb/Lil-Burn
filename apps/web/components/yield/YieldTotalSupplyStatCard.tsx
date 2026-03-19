"use client";

import { StatCard } from "@/components/ui/StatCard";
import { StatCardSkeleton } from "@/components/ui/StatCardSkeleton";
import { useLilBurnTotalSupply } from "@/hooks/queries/useLilBurnTotalSupply";

export function YieldTotalSupplyStatCard() {
  const { data, isSuccess } = useLilBurnTotalSupply();

  if (!isSuccess) {
    return <StatCardSkeleton />;
  }

  return <StatCard value={data} label="Total Supply" />;
}
