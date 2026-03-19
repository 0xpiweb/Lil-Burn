"use client";

import { getDonations } from "@/actions/getDonations";
import { withMinDelay } from "@/lib/queries";
import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";

export function useWarChestEpochDonations(
  epoch: number | undefined,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: ["warChestEpochDonations", epoch, page, pageSize],
    queryFn:
      epoch == null
        ? skipToken
        : withMinDelay(() => getDonations(epoch, page, pageSize)),
    placeholderData: keepPreviousData,
  });
}
