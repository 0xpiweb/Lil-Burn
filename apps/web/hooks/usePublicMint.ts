"use client";

import { writeLilBurn } from "@/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfig, useConnection } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

export function usePublicMint() {
  const config = useConfig();
  const queryClient = useQueryClient();
  const { address } = useConnection();

  return useMutation({
    mutationFn: async ({
      quantity,
      value,
    }: {
      quantity: number;
      value: bigint;
    }) => {
      const hash = await writeLilBurn(config, {
        functionName: "publicMint",
        args: [BigInt(quantity)],
        value,
      });

      await waitForTransactionReceipt(config, {
        hash,
        confirmations: 4,
      });
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mintProgress"] }),
        queryClient.invalidateQueries({ queryKey: ["lilBurnsCount", address] }),
      ]),
  });
}
