"use client";

import { readLilBurn } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useMintProgress() {
  const config = useConfig();

  return useSuspenseQuery({
    refetchInterval: 10000,
    queryKey: ["mintProgress"],
    queryFn: async () => {
      const [nextTokenId, maxSupply] = await Promise.all([
        readLilBurn(config, { functionName: "nextTokenId" }),
        readLilBurn(config, { functionName: "MAX_SUPPLY" }),
      ]);

      const minted = nextTokenId !== undefined ? Number(nextTokenId) - 1 : 0;

      const mintedPercent =
        maxSupply !== undefined ? (minted / Number(maxSupply)) * 100 : 0;

      return {
        minted,
        mintedPercent,
        maxSupply: maxSupply != null ? Number(maxSupply) : 0,
      };
    },
  });
}
