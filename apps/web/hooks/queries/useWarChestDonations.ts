"use client";

import { getDonations } from "@/actions/getDonations";
import { withMinDelay } from "@/lib/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useWarChestDonations(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["warChestDonations", page, pageSize],
    queryFn: withMinDelay(() => getDonations(null, page, pageSize)),
    placeholderData: keepPreviousData,
  });
}
