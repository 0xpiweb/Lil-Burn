"use client";

import { writeLilBurn } from "@/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";
import { useConfig, useConnection } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

export function useWhitelistMint() {
  const config = useConfig();
  const { address } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quantity,
      proof,
      value,
    }: {
      quantity: number;
      proof: Address[];
      value: bigint;
    }) => {
      const hash = await writeLilBurn(config, {
        functionName: "whitelistMint",
        args: [BigInt(quantity), proof],
        value,
      });

      await waitForTransactionReceipt(config, {
        hash,
        confirmations: 4,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mintProgress"] }),
        queryClient.invalidateQueries({ queryKey: ["mintCounts", address] }),
      ]);
    },
  });
}
