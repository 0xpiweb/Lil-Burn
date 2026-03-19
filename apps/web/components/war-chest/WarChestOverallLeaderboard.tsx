"use client";

import { Pagination } from "@/components/ui/Pagination";
import { WarChestLeaderboard } from "@/components/war-chest/WarChestLeaderboard";
import { useWarChestDonations } from "@/hooks/queries/useWarChestDonations";
import { usePage } from "@/hooks/usePage";
import { useConnection } from "wagmi";

const PAGE_SIZE = 10;

export function WarChestOverallLeaderboard() {
  const { page, setPage } = usePage();

  const { address } = useConnection();

  const { data: donations, isFetching: isFetchingDonations } =
    useWarChestDonations(page, PAGE_SIZE);

  return (
    <>
      <WarChestLeaderboard
        minRows={PAGE_SIZE}
        entries={donations?.items}
        pending={isFetchingDonations}
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
