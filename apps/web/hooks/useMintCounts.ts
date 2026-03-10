"use client";

import { readLilBurn } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useConfig } from "wagmi";

export function useMintCounts(address?: Address) {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["mintCounts", address],
    queryFn: async () => {
      if (!address) {
        return { holderMintCount: BigInt(0), whitelistMintCount: BigInt(0) };
      }

      const [holderMintCount, whitelistMintCount] = await Promise.all([
        readLilBurn(config, {
          functionName: "holderMintCount",
          args: [address],
        }),
        readLilBurn(config, {
          functionName: "whitelistMintCount",
          args: [address],
        }),
      ]);

      return { holderMintCount, whitelistMintCount };
    },
  });
}
