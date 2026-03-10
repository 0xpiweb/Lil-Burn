"use client";

import { getOverallLeaderboard } from "@/actions/getOverallLeaderboard";
import { useQuery } from "@tanstack/react-query";

export function useOverallLeaderboard() {
  return useQuery({
    queryKey: ["overallLeaderboard"],
    queryFn: () => getOverallLeaderboard(),
  });
}
