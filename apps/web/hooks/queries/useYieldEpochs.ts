"use client";

import { getYieldEpochs } from "@/actions/getYieldEpochs";
import { withMinDelay } from "@/lib/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useYieldEpochs(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["yieldEpochs", page, pageSize],
    queryFn: withMinDelay(() => getYieldEpochs(page, pageSize)),
    placeholderData: keepPreviousData,
  });
}
