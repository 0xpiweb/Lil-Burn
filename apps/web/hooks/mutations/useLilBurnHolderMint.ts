"use client";

import { useToast } from "@/components/ToastContext";
import { writeLilBurnHolderMint } from "@/generated";
import { trackTransaction } from "@/lib/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import { useConfig, useConnection } from "wagmi";

export function useLilBurnHolderMint() {
  const config = useConfig();

  const queryClient = useQueryClient();

  const toast = useToast();

  const { address: _address } = useConnection();

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
      const address = _address;

      const hash = await writeLilBurnHolderMint(config, {
        args: [BigInt(quantity), maxQuantity, proof],
        value,
      });

      await trackTransaction(config, hash, toast);

      return address;
    },
    onSuccess: async (address) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lilBurnMintProgress"] }),
        queryClient.invalidateQueries({
          queryKey: ["lilBurnMintCounts", address],
        }),
      ]);
    },
  });
}
