"use client";

import { createYieldEpoch } from "@/actions/createYieldEpoch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateYieldEpoch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createYieldEpoch,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["yieldEpochs"] }),
  });
}
