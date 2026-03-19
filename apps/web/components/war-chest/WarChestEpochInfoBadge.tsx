"use client";

import { useWarChestEpochInfo } from "@/hooks/queries/useWarChestEpochInfo";
import { useCountdown } from "@/hooks/useCountdown";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Badge } from "../ui/Badge";
import { BadgeSkeleton } from "../ui/BadgeSkeleton";

export function WarChestEpochInfoBadge() {
  const queryClient = useQueryClient();

  const {
    data: epochInfo,
    isSuccess: isSuccessEpochInfo,
    isFetching: isFetchingEpochInfo,
  } = useWarChestEpochInfo();

  const onExpire = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        typeof queryKey[0] === "string" && queryKey[0].startsWith("warChest"),
    });
  }, [queryClient]);

  const countdown = useCountdown(epochInfo?.nextEpochStart, onExpire);

  return !isSuccessEpochInfo || isFetchingEpochInfo ? (
    <BadgeSkeleton width={200} />
  ) : (
    <Badge>
      Quarter {epochInfo.epoch}: {countdown}
    </Badge>
  );
}
