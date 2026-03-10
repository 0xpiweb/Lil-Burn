"use client";

import { useWarChestContributors } from "@/hooks/useWarChestContributors";
import { StatCard } from "./StatCard";

export function WarChestContributorsStatCard() {
  const { data: contributors } = useWarChestContributors();

  return <StatCard value={contributors} label="Contributors" />;
}
