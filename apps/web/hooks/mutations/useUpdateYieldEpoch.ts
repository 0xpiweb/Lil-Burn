"use client";

import { updateYieldEpoch } from "@/actions/updateYieldEpoch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateYieldEpoch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blockNumber,
      yieldGenerated,
      externalRevenue,
      purgeTotalSpent,
    }: {
      blockNumber: number;
      yieldGenerated: number;
      externalRevenue: number;
      purgeTotalSpent: number;
    }) => {
      await updateYieldEpoch(blockNumber, {
        yieldGenerated,
        externalRevenue,
        purgeTotalSpent,
      });
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["yieldEpochs"] }),
        queryClient.invalidateQueries({ queryKey: ["yieldEpoch"] }),
      ]),
  });
}
