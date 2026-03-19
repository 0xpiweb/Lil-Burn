"use client";

import { readWarChestMinDonation } from "@/generated";
import { withMinDelay } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useConfig } from "wagmi";

export function useWarChestMinDonation() {
  const config = useConfig();

  return useQuery({
    queryKey: ["warChestMinDonation"],
    queryFn: withMinDelay(() => readWarChestMinDonation(config, {})),
  });
}
