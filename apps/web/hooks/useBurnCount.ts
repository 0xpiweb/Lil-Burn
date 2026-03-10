"use client";

import { readLilBurn } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useBurnCount() {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["burnCount"],
    queryFn: async () =>
      Number(
        await readLilBurn(config, {
          functionName: "burnCount",
        }),
      ),
  });
}
