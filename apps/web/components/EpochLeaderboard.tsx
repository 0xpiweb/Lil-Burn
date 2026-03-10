"use client";

import { useEpochLeaderboard } from "@/hooks/useEpochLeaderboard";
import { Address } from "viem";
import { LeaderboardTable } from "./LeaderboardTable";

export function EpochLeaderboard({ address }: { address?: Address }) {
  const { data: entries, isLoading: pending } = useEpochLeaderboard();

  return (
    <LeaderboardTable
      minRows={10}
      entries={entries}
      pending={pending}
      address={address}
    />
  );
}
