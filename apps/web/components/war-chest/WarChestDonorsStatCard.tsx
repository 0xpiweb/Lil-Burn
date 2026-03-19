"use client";

import { StatCard } from "@/components/ui/StatCard";

export function WarChestDonorsStatCard({ donorCount }: { donorCount: number }) {
  return <StatCard value={donorCount} label="Donors" />;
}
