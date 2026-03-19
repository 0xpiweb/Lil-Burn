"use client";

import { NftVariantIcon } from "@/components/nft/NftVariantIcon";
import { CloseButton } from "@/components/ui/CloseButton";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { useTransactionUrl } from "@/hooks/useTransactionUrl";
import { formatDateUTC, formatHex } from "@/lib/format";
import { twJoin } from "@/lib/tw";
import type { LilBurn } from "@/types/LilBurn";
import Image from "next/image";
import { NftModalRow } from "./NftModalRow";
import { NftRibbon } from "./NftRibbon";

export function NftModalContent({
  nft,
  isMine,
  onClose,
}: {
  nft: LilBurn;
  isMine?: boolean;
  onClose: () => void;
}) {
  const transactionUrl = useTransactionUrl();

  return (
    <GrungeCard
      className={twJoin(
        "w-full max-w-3xl rounded shadow-2xl",
        isMine && "glow-border-red border-red-900/70",
      )}
    >
      <div className="flex flex-col glow-border-red sm:flex-row">
        <div className="relative aspect-square w-full shrink-0 sm:w-96 md:w-125">
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className={twJoin("object-cover", nft.isBurned && "saturate-[0.1]")}
          />

          {isMine && <NftRibbon />}

          <NftVariantIcon isBurned={nft.isBurned} isCursed={nft.isCursed} />
        </div>

        <div className="flex grow flex-col gap-4 overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-zinc-100">
              {nft.name}
            </h2>

            <CloseButton onClose={onClose} />
          </div>

          <dl className="flex flex-col gap-3 text-sm">
            <NftModalRow label="Artist" value={nft.artist} />

            <NftModalRow label="F1R3 Crew" value={nft.f1r3Crew} />

            <NftModalRow label="Sweep Score" value={String(nft.sweepScore)} />

            {nft.isCursed && (
              <>
                <NftModalRow
                  label="Cursed on"
                  value={formatDateUTC(nft.cursedAt!)}
                />

                <NftModalRow
                  label="Curse milestone"
                  value={String(nft.cursedMilestone)}
                />
              </>
            )}

            {nft.isBurned && (
              <>
                <NftModalRow
                  label="Burned on"
                  value={formatDateUTC(nft.burnBlockTimestamp!)}
                />

                <NftModalRow
                  label="Burn Tx Hash"
                  value={formatHex(nft.burnTransactionHash!)}
                  href={transactionUrl(nft.burnTransactionHash!)}
                />
              </>
            )}
          </dl>
        </div>
      </div>
    </GrungeCard>
  );
}
