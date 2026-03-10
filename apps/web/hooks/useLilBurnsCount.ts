"use client";

import { readLilBurn } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useConfig } from "wagmi";

export function useLilBurnsCount(address?: Address) {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["lilBurnsCount", address],
    queryFn: () => {
      if (!address) {
        return BigInt(0);
      }

      return readLilBurn(config, {
        functionName: "balanceOf",
        args: [address],
      });
    },
  });
}
