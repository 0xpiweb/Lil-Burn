"use client";

import { writeLilBurn } from "@/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";
import { useConfig, useConnection } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

export function useHolderMint() {
  const config = useConfig();
  const { address } = useConnection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quantity,
      maxQuantity,
      proof,
      value,
    }: {
      quantity: number;
      maxQuantity: bigint;
      proof: Address[];
      value: bigint;
    }) => {
      const hash = await writeLilBurn(config, {
        functionName: "holderMint",
        args: [BigInt(quantity), maxQuantity, proof],
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
