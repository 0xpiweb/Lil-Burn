"use client";

import { readLilBurn } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useMintStatus() {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["mintStatus"],
    queryFn: async () => {
      const [holderStart, whitelistStart, publicStart, isPaused] =
        await Promise.all([
          readLilBurn(config, { functionName: "holderStart" }),
          readLilBurn(config, { functionName: "whitelistStart" }),
          readLilBurn(config, { functionName: "publicStart" }),
          readLilBurn(config, { functionName: "paused" }),
        ]);

      return { holderStart, whitelistStart, publicStart, isPaused };
    },
  });
}
