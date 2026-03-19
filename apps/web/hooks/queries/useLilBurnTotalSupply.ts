"use client";

import { readLilBurnTotalSupply } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useLilBurnTotalSupply() {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnTotalSupply"],
    queryFn: withMinDelay(async () =>
      Number(await readLilBurnTotalSupply(config, {})),
    ),
  });
}
