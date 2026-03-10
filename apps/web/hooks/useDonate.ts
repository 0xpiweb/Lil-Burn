"use client";

import { writeWarChest } from "@/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

export function useDonate() {
  const config = useConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ value }: { value: bigint }) => {
      const hash = await writeWarChest(config, {
        functionName: "donate",
        value,
      });

      await waitForTransactionReceipt(config, {
        hash,
        confirmations: 4,
      });
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["warChestTotal"] }),
        queryClient.invalidateQueries({ queryKey: ["warChestContributors"] }),
        queryClient.invalidateQueries({ queryKey: ["warChestDonations"] }),
        queryClient.invalidateQueries({ queryKey: ["overallLeaderboard"] }),
        queryClient.invalidateQueries({ queryKey: ["epochLeaderboard"] }),
      ]),
  });
}
