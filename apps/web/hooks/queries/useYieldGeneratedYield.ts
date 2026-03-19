"use client";

import { getYieldGenerated } from "@/actions/getYieldGenerated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useYieldGeneratedYield() {
  return useQuery({
    queryKey: ["yieldGeneratedYield"],
    queryFn: withMinDelay(getYieldGenerated),
  });
}
