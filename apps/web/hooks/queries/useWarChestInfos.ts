"use client";

import { getWarChestInfos } from "@/actions/getWarChestInfos";
import { withMinDelay } from "@/lib/queries";
import { skipToken, useQuery } from "@tanstack/react-query";

export function useWarChestInfos(epoch?: number | null) {
  return useQuery({
    queryKey: ["warChestInfos", epoch],
    queryFn:
      epoch === undefined
        ? skipToken
        : withMinDelay(() => getWarChestInfos(epoch)),
  });
}
