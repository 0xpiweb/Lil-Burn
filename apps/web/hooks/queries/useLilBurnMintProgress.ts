"use client";

import { readLilBurnMaxSupply, readLilBurnNextTokenId } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useLilBurnMintProgress() {
  const config = useConfig();

  return useQuery({
    refetchInterval: 10000,
    queryKey: ["lilBurnMintProgress"],
    queryFn: withMinDelay(async () => {
      const [nextTokenId, maxSupply] = await Promise.all([
        readLilBurnNextTokenId(config, {}),
        readLilBurnMaxSupply(config, {}),
      ]);

      const minted = nextTokenId !== undefined ? Number(nextTokenId) - 1 : 0;

      const mintedPercent =
        maxSupply !== undefined ? (minted / Number(maxSupply)) * 100 : 0;

      return {
        minted,
        mintedPercent,
        maxSupply: maxSupply != null ? Number(maxSupply) : 0,
      };
    }),
  });
}
