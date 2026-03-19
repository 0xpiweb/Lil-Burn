"use client";

import { NftModalContent } from "@/components/nft/NftModalContent";
import { NftModalContentSkeleton } from "@/components/nft/NftModalContentSkeleton";
import { Modal } from "@/components/ui/Modal";
import { useLilBurn } from "@/hooks/queries/useLilBurn";
import { useLilBurnTokenIds } from "@/hooks/queries/useLilBurnTokenIds";
import { useConnection } from "wagmi";

export function NftModal({ id, onClose }: { id: number; onClose: () => void }) {
  const { data: nft } = useLilBurn(id);

  const { address } = useConnection();

  const { data: tokenIds, isLoading: isLoadingTokenIds } =
    useLilBurnTokenIds(address);

  return (
    <Modal onClose={onClose}>
      {nft == null || isLoadingTokenIds ? (
        <NftModalContentSkeleton onClose={onClose} />
      ) : (
        <NftModalContent
          nft={nft}
          isMine={tokenIds?.includes(nft.tokenId)}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
