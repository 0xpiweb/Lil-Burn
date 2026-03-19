"use client";

import { readLilBurnMaxPublicMint } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useLilBurnMaxPublicMint() {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnMaxPublicMint"],
    queryFn: withMinDelay(() => readLilBurnMaxPublicMint(config, {})),
  });
}
