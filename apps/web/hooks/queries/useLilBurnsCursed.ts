"use client";

import { getCursedLilBurns } from "@/actions/getCursedLilBurns";
import { withMinDelay } from "@/lib/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useLilBurnsCursed(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["cursedLilBurns", page, pageSize],
    queryFn: withMinDelay(() => getCursedLilBurns(page, pageSize)),
    placeholderData: keepPreviousData,
  });
}
