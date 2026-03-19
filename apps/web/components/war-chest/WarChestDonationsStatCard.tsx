"use client";

import { StatCard } from "@/components/ui/StatCard";

export function WarChestDonationsStatCard({
  donationCount,
}: {
  donationCount: number;
}) {
  return <StatCard value={donationCount} label="Donations" />;
}
