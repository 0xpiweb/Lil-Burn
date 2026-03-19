"use client";

import { readLilBurnBalanceOf } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { useConfig } from "wagmi";

export function useLilBurnsCount(address?: Address) {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnsCount", address],
    queryFn: !address
      ? skipToken
      : withMinDelay(() => readLilBurnBalanceOf(config, { args: [address] })),
  });
}
