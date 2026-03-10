"use client";

import { getProof } from "@/actions/getProof";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

export function useProof(address?: Address) {
  return useQuery({
    queryKey: ["proof", address],
    queryFn: async () => {
      if (!address) {
        return null;
      }

      const proof = await getProof(address);

      return proof;
    },
  });
}
