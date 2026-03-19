"use client";

import { useToast } from "@/components/ToastContext";
import { writeLilBurnBurn } from "@/generated";
import { trackTransaction } from "@/lib/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfig, useConnection } from "wagmi";

export function useLilBurnBurn() {
  const config = useConfig();

  const queryClient = useQueryClient();

  const toast = useToast();

  const { address: _address } = useConnection();

  return useMutation({
    mutationFn: async ({ tokenIds }: { tokenIds: number[] }) => {
      const address = _address;

      const hashes = await Promise.all(
        tokenIds.map((id) => writeLilBurnBurn(config, { args: [BigInt(id)] })),
      );

      await trackTransaction(config, hashes, toast);

      return address;
    },
    onSuccess: (address) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["lilBurnTokenIds", address],
        }),
        queryClient.invalidateQueries({ queryKey: ["lilBurnBurnCount"] }),
        queryClient.invalidateQueries({ queryKey: ["cursedStats"] }),
      ]),
  });
}
