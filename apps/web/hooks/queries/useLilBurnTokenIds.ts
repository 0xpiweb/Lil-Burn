"use client";

import { readLilBurnTokensOfOwner } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { useConfig } from "wagmi";

export function useLilBurnTokenIds(address?: Address) {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnTokenIds", address],
    queryFn: !address
      ? skipToken
      : withMinDelay(async () =>
          (await readLilBurnTokensOfOwner(config, { args: [address] })).map(
            Number,
          ),
        ),
  });
}
