"use client";

import {
  readWarChestCurrentEpoch,
  readWarChestNextEpochStart,
} from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useWarChestEpochInfo() {
  const config = useConfig();

  return useQuery({
    queryKey: ["warChestEpochInfo"],
    queryFn: withMinDelay(async () => {
      const [epoch, nextEpochStart] = await Promise.all([
        readWarChestCurrentEpoch(config, {}),
        readWarChestNextEpochStart(config, {}),
      ]);

      return { epoch: Number(epoch), nextEpochStart: Number(nextEpochStart) };
    }),
  });
}
