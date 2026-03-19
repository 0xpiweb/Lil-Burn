"use client";

import { Pagination } from "@/components/ui/Pagination";
import { WarChestLeaderboard } from "@/components/war-chest/WarChestLeaderboard";
import { useWarChestEpochDonations } from "@/hooks/queries/useWarChestEpochDonations";
import { useWarChestEpochInfo } from "@/hooks/queries/useWarChestEpochInfo";
import { usePage } from "@/hooks/usePage";
import { useConnection } from "wagmi";

const PAGE_SIZE = 10;

export function WarChestEpochLeaderboard() {
  const { page, setPage } = usePage();

  const { address } = useConnection();

  const { data: epochInfo, isLoading: isLoadingEpochInfo } =
    useWarChestEpochInfo();

  const { data: donations, isFetching: isFetchingDonations } =
    useWarChestEpochDonations(epochInfo?.epoch, page, PAGE_SIZE);

  return (
    <>
      <WarChestLeaderboard
        minRows={PAGE_SIZE}
        entries={donations?.items}
        pending={isLoadingEpochInfo || isFetchingDonations}
        address={address}
      />

      <Pagination
        page={page}
        totalPages={donations?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </>
  );
}
