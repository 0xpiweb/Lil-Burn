"use client";

import { NftCard } from "@/components/nft/NftCard";
import { NftCardEmpty } from "@/components/nft/NftCardEmpty";
import { NftCardSkeleton } from "@/components/nft/NftCardSkeleton";
import { useNftModal } from "@/components/nft/NftModalContext";
import { CardsGrid } from "@/components/ui/CardsGrid";
import { Pagination } from "@/components/ui/Pagination";
import { useLilBurnsCursed } from "@/hooks/queries/useLilBurnsCursed";
import { useLilBurnTokenIds } from "@/hooks/queries/useLilBurnTokenIds";
import { usePage } from "@/hooks/usePage";
import { useConnection } from "wagmi";

const PAGE_SIZE = 9;

export function CursedNFTs() {
  const { page, setPage } = usePage();

  const {
    data: lilBurns,
    isSuccess: isSuccessLilBurns,
    isFetching: isFetchingLilBurns,
  } = useLilBurnsCursed(page, PAGE_SIZE);

  const { address } = useConnection();

  const { data: tokenIds, isLoading: isLoadingTokenIds } =
    useLilBurnTokenIds(address);

  const { openNftModal } = useNftModal();

  return (
    <>
      <CardsGrid>
        {!isSuccessLilBurns || isLoadingTokenIds || isFetchingLilBurns ? (
          Array.from({ length: PAGE_SIZE }, (_, i) => (
            <NftCardSkeleton key={i} />
          ))
        ) : (
          <>
            {lilBurns.items.map((nft) => (
              <NftCard
                key={nft.tokenId}
                nft={nft}
                isMine={tokenIds?.includes(nft.tokenId)}
                onClick={() => openNftModal(nft.tokenId)}
              />
            ))}

            {Array.from(
              { length: Math.max(0, PAGE_SIZE - lilBurns.items.length) },
              (_, i) => (
                <NftCardEmpty key={i} variant="cursed" />
              ),
            )}
          </>
        )}
      </CardsGrid>

      <Pagination
        page={page}
        totalPages={lilBurns?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </>
  );
}
