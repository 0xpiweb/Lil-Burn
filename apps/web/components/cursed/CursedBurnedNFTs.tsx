"use client";

import { NftCard } from "@/components/nft/NftCard";
import { NftCardEmpty } from "@/components/nft/NftCardEmpty";
import { NftCardSkeleton } from "@/components/nft/NftCardSkeleton";
import { useNftModal } from "@/components/nft/NftModalContext";
import { CardsGrid } from "@/components/ui/CardsGrid";
import { Pagination } from "@/components/ui/Pagination";
import { useLilBurnsBurned } from "@/hooks/queries/useLilBurnsBurned";
import { usePage } from "@/hooks/usePage";

const PAGE_SIZE = 9;

export function CursedBurnedNFTs() {
  const { page, setPage } = usePage();

  const { data, isSuccess, isFetching } = useLilBurnsBurned(page, PAGE_SIZE);

  const { openNftModal } = useNftModal();

  return (
    <>
      <CardsGrid>
        {!isSuccess || isFetching ? (
          Array.from({ length: PAGE_SIZE }, (_, i) => (
            <NftCardSkeleton key={i} />
          ))
        ) : (
          <>
            {data.items.map((nft) => (
              <NftCard
                key={nft.tokenId}
                nft={nft}
                onClick={() => openNftModal(nft.tokenId)}
              />
            ))}

            {Array.from(
              { length: Math.max(0, PAGE_SIZE - data.items.length) },
              (_, i) => (
                <NftCardEmpty key={i} variant="burned" />
              ),
            )}
          </>
        )}
      </CardsGrid>

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </>
  );
}
