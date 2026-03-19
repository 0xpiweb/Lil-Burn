"use client";

import { useToast } from "@/components/ToastContext";
import { writeWarChestDonate } from "@/generated";
import { trackTransaction } from "@/lib/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useWarChestDonate() {
  const config = useConfig();

  const toast = useToast();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ value }: { value: bigint }) => {
      const hash = await writeWarChestDonate(config, { value });

      await trackTransaction(config, hash, toast);
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["warChestInfos"] }),
        queryClient.invalidateQueries({ queryKey: ["warChestDonations"] }),
        queryClient.invalidateQueries({ queryKey: ["warChestEpochDonations"] }),
      ]),
  });
}
