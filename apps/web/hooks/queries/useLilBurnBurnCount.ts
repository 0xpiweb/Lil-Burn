"use client";

import { readLilBurnBurnCount } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useLilBurnBurnCount() {
  const config = useConfig();

  return useQuery({
    queryKey: ["lilBurnBurnCount"],
    queryFn: withMinDelay(async () =>
      Number(await readLilBurnBurnCount(config, {})),
    ),
  });
}
