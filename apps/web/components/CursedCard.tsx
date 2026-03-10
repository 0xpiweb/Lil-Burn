"use client";

import { GrungeCard } from "@/components/GrungeCard";
import { CursedNFT } from "@/types/CursedNFT";
import Image from "next/image";

export function CursedCardEmpty({
  burnMilestone,
  burned,
}: {
  burnMilestone: number;
  burned: number;
}) {
  const progress = Math.min((burned / burnMilestone) * 100, 100);

  return (
    <GrungeCard className="overflow-hidden rounded-sm">
      <div className="flex aspect-square items-center justify-center bg-zinc-900">
        <span className="font-display text-6xl font-black text-zinc-600 select-none">
          ?
        </span>
      </div>

      <div className="flex flex-col gap-1.5 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-500">
            Milestone: {burnMilestone}
          </span>

          <span className="text-xs font-semibold text-zinc-600">
            {burned}/{burnMilestone}
          </span>
        </div>

        <div className="h-1 w-full rounded-full bg-zinc-800">
          <div
            className="h-1 rounded-full bg-orange-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </GrungeCard>
  );
}

export function CursedCard({ nft }: { nft: CursedNFT }) {
  return (
    <GrungeCard className="overflow-hidden rounded-sm">
      <div className="relative aspect-square overflow-hidden">
        <Image src={nft.image} alt={nft.name} fill className="object-cover" />
      </div>

      <div className="px-3 py-2.5">
        <span className="text-sm font-semibold text-zinc-300">{nft.name}</span>
      </div>
    </GrungeCard>
  );
}
