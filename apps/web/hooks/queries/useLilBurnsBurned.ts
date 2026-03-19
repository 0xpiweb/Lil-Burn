"use client";

import { getBurnedLilBurns } from "@/actions/getBurnedLilBurns";
import { withMinDelay } from "@/lib/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useLilBurnsBurned(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["burnedLilBurns", page, pageSize],
    queryFn: withMinDelay(() => getBurnedLilBurns(page, pageSize)),
    placeholderData: keepPreviousData,
  });
}
