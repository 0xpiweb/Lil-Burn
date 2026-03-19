"use client";

import { getCursedStats } from "@/actions/getCursedStats";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useCursedStats() {
  return useQuery({
    queryKey: ["cursedStats"],
    queryFn: withMinDelay(getCursedStats),
  });
}
