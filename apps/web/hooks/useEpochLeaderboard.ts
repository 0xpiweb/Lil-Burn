"use client";

import { getEpochLeaderboard } from "@/actions/getEpochLeaderboard";
import { readWarChest } from "@/generated";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useEpochLeaderboard() {
  const config = useConfig();

  return useQuery({
    queryKey: ["epochLeaderboard"],
    queryFn: async () => {
      const epoch = Number(
        await readWarChest(config, {
          functionName: "currentEpoch",
        }),
      );

      return getEpochLeaderboard(epoch);
    },
  });
}
