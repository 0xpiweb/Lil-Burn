"use client";

import { StatCard } from "@/components/ui/StatCard";

export function WarChestTotalStatCard({
  totalAmount,
}: {
  totalAmount: number;
}) {
  return <StatCard value={totalAmount} label="Total AVAX" />;
}
