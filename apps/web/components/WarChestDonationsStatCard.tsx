"use client";

import { useWarChestDonations } from "@/hooks/useWarChestDonations";
import { StatCard } from "./StatCard";

export function WarChestDonationsStatCard() {
  const { data: donations } = useWarChestDonations();

  return <StatCard value={donations} label="Donations" />;
}
