"use client";

import { getLilBurn } from "@/actions/getLilBurn";
import { withMinDelay } from "@/lib/queries";
import { skipToken, useQuery } from "@tanstack/react-query";

export function useLilBurn(tokenId: number) {
  return useQuery({
    queryKey: ["lilBurn", tokenId],
    queryFn:
      tokenId == null ? skipToken : withMinDelay(() => getLilBurn(tokenId)),
  });
}
