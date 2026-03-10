"use client";

import { useOverallLeaderboard } from "@/hooks/useOverallLeaderboard";
import { Address } from "viem";
import { LeaderboardTable } from "./LeaderboardTable";

export function OverallLeaderboard({ address }: { address?: Address }) {
  const { data: entries, isLoading: pending } = useOverallLeaderboard();

  return (
    <LeaderboardTable
      minRows={10}
      entries={entries}
      pending={pending}
      address={address}
    />
  );
}
