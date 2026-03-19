"use client";

import { YieldEpochDetail } from "@/components/yield/YieldEpochDetail";
import { YieldEpochDetailSkeleton } from "@/components/yield/YieldEpochDetailSkeleton";
import { useLilBurnMaxSupply } from "@/hooks/queries/useLilBurnMaxSupply";
import { useYieldEpoch } from "@/hooks/queries/useYieldEpoch";
import { useYieldEpochsAndFirstDetail } from "@/hooks/queries/useYieldEpochsAndFirstDetail";
import { usePage } from "@/hooks/usePage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { YieldEpochSelector } from "./YieldEpochSelector";

const PAGE_SIZE = 10;

export function YieldEpochSection() {
  const { page, setPage } = usePage();

  const {
    data: epochsData,
    isLoading: isEpochsLoading,
    isFetching: isEpochsFetching,
  } = useYieldEpochsAndFirstDetail(page, PAGE_SIZE);

  const searchParams = useSearchParams();

  const router = useRouter();

  const selectedEpochNumber = searchParams.has("epoch")
    ? Number(searchParams.get("epoch"))
    : epochsData?.items[0]?.number;

  const setSelectedEpochNumber = useCallback(
    (newNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newNumber === epochsData?.items[0]?.number) {
        params.delete("epoch");
      } else {
        params.set("epoch", String(newNumber));
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, epochsData],
  );

  const firstEpochDetail =
    selectedEpochNumber === epochsData?.items[0]?.number
      ? epochsData?.firstEpochDetail
      : undefined;

  const { data: epochDetail, isLoading: detailLoading } = useYieldEpoch(
    selectedEpochNumber,
    firstEpochDetail,
  );

  const { data: maxSupply, isSuccess: isMaxSupplySuccess } =
    useLilBurnMaxSupply();

  return (
    <>
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <YieldEpochSelector
          epochs={epochsData?.items ?? []}
          selectedNumber={selectedEpochNumber}
          onSelect={setSelectedEpochNumber}
          page={page}
          totalPages={epochsData?.totalPages ?? 1}
          onPageChange={setPage}
          isLoading={isEpochsLoading}
          isFetching={isEpochsFetching}
        />

        {detailLoading || !epochDetail || !isMaxSupplySuccess ? (
          <YieldEpochDetailSkeleton />
        ) : (
          <YieldEpochDetail epoch={epochDetail} maxSupply={maxSupply} />
        )}
      </div>
    </>
  );
}
