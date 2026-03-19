"use client";

import { getYieldEpochsAndFirstDetail } from "@/actions/getYieldEpochsAndFirstDetail";
import { withMinDelay } from "@/lib/queries";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

export function useYieldEpochsAndFirstDetail(page: number, pageSize: number) {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["yieldEpochsWithDetail", page, pageSize],
    queryFn: withMinDelay(() => getYieldEpochsAndFirstDetail(page, pageSize)),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const detail = result.data?.firstEpochDetail;

    if (detail) {
      queryClient.setQueryData(["yieldEpoch", detail.number], detail);
    }
  }, [result.data, queryClient]);

  return result;
}
