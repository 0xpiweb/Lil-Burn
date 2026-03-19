import { NftRibbon } from "@/components/nft/NftRibbon";
import { NftVariantIcon } from "@/components/nft/NftVariantIcon";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { Pill } from "@/components/ui/Pill";
import type { LilBurn } from "@/types/LilBurn";
import Image from "next/image";
import { twJoin } from "tailwind-merge";

export const FOOTER_HEIGHT = 44;

export function NftCard({
  nft,
  isMine,
  onClick,
}: {
  nft: LilBurn;
  isMine?: boolean;
  onClick?: () => void;
}) {
  return (
    <GrungeCard
      className={twJoin(
        "overflow-hidden rounded-sm",
        isMine && "glow-border-red border-red-900/70",
        onClick != null && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className={twJoin("object-cover", nft.isBurned && "saturate-[0.1]")}
        />

        <NftVariantIcon isBurned={nft.isBurned} isCursed={nft.isCursed} />
      </div>

      {isMine && <NftRibbon />}

      <div
        className="flex items-center justify-between px-3"
        style={{ height: FOOTER_HEIGHT }}
      >
        <span className="text-sm font-semibold text-zinc-300">{nft.name}</span>

        {nft.cursedMilestone != null ? (
          <Pill>Milestone: {nft.cursedMilestone}</Pill>
        ) : null}
      </div>
    </GrungeCard>
  );
}
