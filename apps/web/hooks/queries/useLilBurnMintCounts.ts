"use client";

import {
  readLilBurnHolderMintCount,
  readLilBurnWhitelistMintCount,
} from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { useConfig } from "wagmi";

export function useLilBurnMintCounts(address?: Address) {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnMintCounts", address],
    queryFn: !address
      ? skipToken
      : withMinDelay(async () => {
          const [holderMintCount, whitelistMintCount] = await Promise.all([
            readLilBurnHolderMintCount(config, { args: [address] }),
            readLilBurnWhitelistMintCount(config, { args: [address] }),
          ]);

          return { holderMintCount, whitelistMintCount };
        }),
  });
}
