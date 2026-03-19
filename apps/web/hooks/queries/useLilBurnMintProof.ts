"use client";

import { getProof } from "@/actions/getProof";
import { withMinDelay } from "@/lib/queries";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

export function useLilBurnMintProof(address?: Address) {
  return useQuery({
    queryKey: ["lilBurnMintProof", address],
    queryFn: !address ? skipToken : withMinDelay(() => getProof(address)),
  });
}
