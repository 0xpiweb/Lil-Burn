"use client";

import { useToast } from "@/components/ToastContext";
import { writeLilBurnWhitelistMint } from "@/generated";
import { trackTransaction } from "@/lib/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import { useConfig, useConnection } from "wagmi";

export function useLilBurnWhitelistMint() {
  const config = useConfig();

  const queryClient = useQueryClient();

  const toast = useToast();

  const { address: _address } = useConnection();

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
      const address = _address;

      const hash = await writeLilBurnWhitelistMint(config, {
        args: [BigInt(quantity), proof],
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
