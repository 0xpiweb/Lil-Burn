"use client";

import { readWarChest } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { useConfig } from "wagmi";

export function useWarChestTotal() {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["warChestTotal"],
    queryFn: async () => {
      const totalDonated = await readWarChest(config, {
        functionName: "totalDonated",
      });

      return Number(formatEther(totalDonated));
    },
  });
}
