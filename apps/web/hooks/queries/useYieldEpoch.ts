"use client";

import { getYieldEpoch } from "@/actions/getYieldEpoch";
import { withMinDelay } from "@/lib/queries";
import type { YieldEpochDetail } from "@/types/YieldEpochDetail";
import { skipToken, useQuery } from "@tanstack/react-query";

export function useYieldEpoch(
  epochNumber?: number,
  initialData?: YieldEpochDetail | null,
) {
  return useQuery({
    queryKey: ["yieldEpoch", epochNumber],
    queryFn:
      epochNumber == null
        ? skipToken
        : withMinDelay(() => getYieldEpoch(epochNumber)),
    initialData: initialData ?? undefined,
  });
}
