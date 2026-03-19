import { NftBadgeButton } from "@/components/nft/NftBadgeButton";
import { HorizontalLine } from "@/components/ui/HorizontalLine";
import type { ComponentPropsWithoutRef } from "react";

export function YieldEpochDetailNftBadges({
  qualifier,
  nfts,
  variant,
}: {
  qualifier: string;
  nfts: { tokenId: number }[];
  variant: ComponentPropsWithoutRef<typeof NftBadgeButton>["variant"];
}) {
  return (
    <>
      <HorizontalLine />

      <div className="flex flex-col gap-2">
        <p className="text-xs tracking-widest text-zinc-500 uppercase">
          {nfts.length} {nfts.length > 1 ? "NFTs" : "NFT"} {qualifier}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {nfts.map(({ tokenId }) => (
            <NftBadgeButton key={tokenId} tokenId={tokenId} variant={variant} />
          ))}
        </div>
      </div>
    </>
  );
}
