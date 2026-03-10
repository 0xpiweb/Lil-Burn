"use client";

import { useBurnCount } from "@/hooks/useBurnCount";
import { StatCard } from "./StatCard";

export function CursedBurnCountStatCard() {
  const { data: burnCount } = useBurnCount();

  return <StatCard value={Number(burnCount)} label="Burned" />;
}
