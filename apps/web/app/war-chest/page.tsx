import { Badge } from "@/components/Badge";
import { GradientText } from "@/components/GradientText";
import { Page } from "@/components/Page";
import { StatCardSkeleton } from "@/components/StatCardSkeleton";
import { WarChestContributorsStatCard } from "@/components/WarChestContributorsStatCard";
import { WarChestDonateCard } from "@/components/WarChestDonateCard";
import { WarChestDonationsStatCard } from "@/components/WarChestDonationsStatCard";
import { WarChestLeaderboard } from "@/components/WarChestLeaderboard";
import { WarChestTabs } from "@/components/WarChestTabs";
import { WarChestTotalStatCard } from "@/components/WarChestTotalStatCard";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "War Chest | Lil-Burn",
  description:
    "Lil-Burn's strategic reserve—a community-funded treasury fueling the hyper-deflationary burn mechanism.",
};

export default function WarChestPage() {
  return (
    <Page>
      <Badge>The Arsenal</Badge>

      <h1 className="font-display text-4xl font-black text-white uppercase sm:text-5xl">
        War <GradientText>Chest</GradientText>
      </h1>

      <div className="flex max-w-2xl flex-col gap-4 text-center">
        <h2 className="font-display text-2xl font-bold tracking-wide text-white">
          Strategic Survival Fund
        </h2>

        <p className="text-sm leading-relaxed text-zinc-400">
          The War Chest is Lil-Burn&apos;s strategic reserve—a community-funded
          treasury designed to fuel the hyper-deflationary burn mechanism and
          sustain the project&apos;s long-term survival strategy.
        </p>
        <p className="text-sm leading-relaxed text-zinc-400">
          Every AVAX contributed to the War Chest strengthens our collective
          defenses against volatility and accelerates the eternal burn. Those
          who are designated strategists in very early and persistently earn 42%
          by NFTs, creating special statuses on Chain and yield-bearing rewards.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        <Suspense fallback={<StatCardSkeleton />}>
          <WarChestTotalStatCard />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <WarChestContributorsStatCard />
        </Suspense>

        <Suspense fallback={<StatCardSkeleton />}>
          <WarChestDonationsStatCard />
        </Suspense>
      </div>

      <WarChestDonateCard />

      <WarChestTabs />

      <WarChestLeaderboard />
    </Page>
  );
}
