"use client";

import { readWarChest } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useWarChestContributors() {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["warChestContributors"],
    queryFn: async () => {
      const totalDonors = await readWarChest(config, {
        functionName: "totalDonors",
      });

      return Number(totalDonors);
    },
  });
}
