"use client";

import { readWarChest } from "@/generated";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useMinDonation() {
  const config = useConfig();

  return useQuery({
    queryKey: ["minDonation"],
    queryFn: () =>
      readWarChest(config, {
        functionName: "MIN_DONATION",
      }),
  });
}
