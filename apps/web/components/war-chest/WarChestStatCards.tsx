"use client";

import { CardsRow } from "@/components/ui/CardsRow";
import { StatCardSkeleton } from "@/components/ui/StatCardSkeleton";
import { WarChestDonationsStatCard } from "@/components/war-chest/WarChestDonationsStatCard";
import { WarChestDonorsStatCard } from "@/components/war-chest/WarChestDonorsStatCard";
import { WarChestTotalStatCard } from "@/components/war-chest/WarChestTotalStatCard";
import { useWarChestEpochInfo } from "@/hooks/queries/useWarChestEpochInfo";
import { useWarChestInfos } from "@/hooks/queries/useWarChestInfos";
import { useSearchParams } from "next/navigation";

export function WarChestStatCards() {
  const tab = useSearchParams().get("tab");

  const isEpochTab = tab === null;

  const { data: epochInfo } = useWarChestEpochInfo();

  const {
    data: infos,
    isSuccess: isSuccessInfos,
    isFetching: isFetchingInfos,
  } = useWarChestInfos(isEpochTab ? epochInfo?.epoch : null);

  return (
    <CardsRow>
      {!isSuccessInfos || isFetchingInfos ? (
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      ) : (
        <>
          <WarChestTotalStatCard totalAmount={infos.totalAmount} />
          <WarChestDonorsStatCard donorCount={infos.donorCount} />
          <WarChestDonationsStatCard donationCount={infos.donationCount} />
        </>
      )}
    </CardsRow>
  );
}
