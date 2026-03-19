"use client";

import { readLilBurnMaxSupply } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useLilBurnMaxSupply() {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnMaxSupply"],
    queryFn: withMinDelay(async () =>
      Number(await readLilBurnMaxSupply(config, {})),
    ),
    staleTime: Infinity,
  });
}
