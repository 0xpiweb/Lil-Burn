"use client";

import { useToast } from "@/components/ToastContext";
import { writeLilBurnPublicMint } from "@/generated";
import { trackTransaction } from "@/lib/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfig, useConnection } from "wagmi";

export function useLilBurnPublicMint() {
  const config = useConfig();

  const queryClient = useQueryClient();

  const toast = useToast();

  const { address: _address } = useConnection();

  return useMutation({
    mutationFn: async ({
      quantity,
      value,
    }: {
      quantity: number;
      value: bigint;
    }) => {
      const address = _address;

      const hash = await writeLilBurnPublicMint(config, {
        args: [BigInt(quantity)],
        value,
      });

      await trackTransaction(config, hash, toast);

      return address;
    },
    onSuccess: (address) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lilBurnMintProgress"] }),
        queryClient.invalidateQueries({
          queryKey: ["lilBurnMintCounts", address],
        }),
      ]),
  });
}
