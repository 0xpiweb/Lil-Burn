"use client";

import { readLilBurn } from "@/generated";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useMintPrice() {
  const config = useConfig();

  return useSuspenseQuery({
    queryKey: ["mintPrice"],
    queryFn: () => readLilBurn(config, { functionName: "MINT_PRICE" }),
  });
}
