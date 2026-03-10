import { Badge } from "@/components/Badge";
import { CursedBurnCountStatCard } from "@/components/CursedBurnCountStatCard";
import { CursedCard, CursedCardEmpty } from "@/components/CursedCard";
import { CursedCountStatCard } from "@/components/CursedCountStatCard";
import { CursedMilestoneProgress } from "@/components/CursedMilestoneProgress";
import { CursedMilestoneProgressSkeleton } from "@/components/CursedMilestoneProgressSkeleton";
import { GradientText } from "@/components/GradientText";
import { Page } from "@/components/Page";
import { StatCardSkeleton } from "@/components/StatCardSkeleton";
import { type CursedNFT } from "@/types/CursedNFT";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "The Cursed 100 | Lil-Burn",
  description: "The fallen NFTs, forever cursed in the eternal burn.",
};

const TOTAL_BURNED = 10;

const cursedNFTs: CursedNFT[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Cursed #${i + 1}`,
  image: `/cover.png`,
  burnMilestone: (i + 1) * 100,
}));

export default function Cursed() {
  return (
    <Page>
      <Badge>The Graveyard</Badge>

      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-4xl font-black text-white uppercase sm:text-5xl">
          The <GradientText>Cursed 100</GradientText>
        </h1>

        <p className="max-w-md text-sm text-zinc-400">
          The fallen NFTs, forever cursed in the eternal burn. These tokens met
          their fate and live on in the graveyard.
        </p>
      </div>

      <div className="flex w-full flex-col justify-center gap-5 sm:flex-row">
        <div className="w-full sm:basis-1/3">
          <Suspense fallback={<StatCardSkeleton />}>
            <CursedBurnCountStatCard />
          </Suspense>
        </div>

        <div className="w-full sm:basis-1/3">
          <Suspense fallback={<StatCardSkeleton />}>
            <CursedCountStatCard />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<CursedMilestoneProgressSkeleton />}>
        <CursedMilestoneProgress />
      </Suspense>

      <div className="flex w-full flex-col items-center gap-4">
        <h2 className="font-display text-2xl font-bold tracking-wide text-white">
          The Graveyard
        </h2>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cursedNFTs.map((nft) => (
            <CursedCard key={nft.id} nft={nft} />
          ))}

          {cursedNFTs.map((nft) => (
            <CursedCardEmpty
              key={nft.id}
              burnMilestone={nft.burnMilestone}
              burned={TOTAL_BURNED}
            />
          ))}
        </div>
      </div>
    </Page>
  );
}
