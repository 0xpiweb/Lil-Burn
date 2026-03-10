"use client";

import { useBurnCount } from "@/hooks/useBurnCount";
import { useBurnInfos } from "@/hooks/useBurnInfos";
import { StatCard } from "./StatCard";

export function CursedCountStatCard() {
  const { data: burnCount } = useBurnCount();

  const { cursed } = useBurnInfos({ burnCount });

  return <StatCard value={cursed} label="Cursed" />;
}
