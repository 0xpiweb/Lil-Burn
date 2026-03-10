"use client";

import { useWarChestTotal } from "@/hooks/useWarChestTotal";
import { StatCard } from "./StatCard";

export function WarChestTotalStatCard() {
  const { data: total } = useWarChestTotal();

  return <StatCard value={total} label="Total AVAX" />;
}
