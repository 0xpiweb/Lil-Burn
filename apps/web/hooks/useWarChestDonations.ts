"use client";

import { readWarChest } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useWarChestDonations() {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["warChestDonations"],
    queryFn: async () => {
      const totalDonations = await readWarChest(config, {
        functionName: "totalDonations",
      });

      return Number(totalDonations);
    },
  });
}
