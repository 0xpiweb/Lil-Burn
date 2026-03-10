"use client";

import { readLilBurn } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useMaxPublicMints() {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["maxPublicMints"],
    queryFn: () =>
      readLilBurn(config, {
        functionName: "MAX_PUBLIC_MINT",
      }),
  });
}
