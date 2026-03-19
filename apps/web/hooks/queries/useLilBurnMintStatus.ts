"use client";

import {
  readLilBurnHolderStart,
  readLilBurnPaused,
  readLilBurnPublicStart,
  readLilBurnWhitelistStart,
} from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useLilBurnMintStatus() {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnMintStatus"],
    queryFn: withMinDelay(async () => {
      const [holderStart, whitelistStart, publicStart, isPaused] =
        await Promise.all([
          readLilBurnHolderStart(config, {}),
          readLilBurnWhitelistStart(config, {}),
          readLilBurnPublicStart(config, {}),
          readLilBurnPaused(config, {}),
        ]);

      return {
        holderStart: Number(holderStart),
        whitelistStart: Number(whitelistStart),
        publicStart: Number(publicStart),
        isPaused,
      };
    }),
  });
}
