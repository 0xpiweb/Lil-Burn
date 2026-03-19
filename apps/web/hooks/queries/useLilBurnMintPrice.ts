"use client";

import { readLilBurnMintPrice } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useLilBurnMintPrice() {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnMintPrice"],
    queryFn: withMinDelay(() => readLilBurnMintPrice(config, {})),
  });
}
