import { LayoutPage } from "@/components/layout/LayoutPage";
import { LayoutPageHero } from "@/components/layout/LayoutPageHero";
import { CardsRow } from "@/components/ui/CardsRow";
import { GradientText } from "@/components/ui/GradientText";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { YieldBurnCountStatCard } from "@/components/yield/YieldBurnCountStatCard";
import { YieldEpochSection } from "@/components/yield/YieldEpochSection";
import { YieldGeneratedYieldStatCard } from "@/components/yield/YieldGeneratedYieldStatCard";
import { YieldTotalSupplyStatCard } from "@/components/yield/YieldTotalSupplyStatCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yield | Lil-Burn",
  description: "Epoch-based yield generation through permanent NFT deflation.",
};

export default function Yield() {
  return (
    <LayoutPage>
      <LayoutPageHero
        title={
          <>
            The <GradientText>Yield</GradientText> Protocol
          </>
        }
        introduction={[
          "Strategic market sweeps funded by ecosystem yield. Each epoch, we manually identify and remove floor-entry NFTs from circulation, using the Sweep Score to prioritize targets. Every sweep is a permanent reduction of the Lil-Burn supply, accelerating the path to the Final 100.",
        ]}
      />

      <CardsRow>
        <YieldGeneratedYieldStatCard />

        <YieldBurnCountStatCard />

        <YieldTotalSupplyStatCard />
      </CardsRow>

      <YieldEpochSection />

      <GrungeCard className="flex w-full flex-col items-center gap-4 rounded-sm px-8 py-8 text-center">
        <h2 className="font-display text-lg tracking-wide text-white uppercase">
          Protocol Mechanics
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          The Yield Protocol is a closed-loop engine designed to force deflation
          by permanently removing NFTs from the market.
        </p>

        <div className="mt-4 flex w-full max-w-3xl flex-col gap-6 text-center">
          <div>
            <h3 className="font-display text-sm tracking-widest text-white uppercase">
              Phase 01: Yield Collection
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              Revenue is harvested from ecosystem yield and treasury growth.
              These funds are consolidated into the Yield Engine at the start of
              each epoch.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-widest text-white uppercase">
              Phase 02: Target Selection
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              We manually identify and market-buy Lil-Burn NFTs listed at the
              floor. The goal is simple: maximize the number of units removed
              from circulation per $AVAX spent.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm tracking-widest text-white uppercase">
              Phase 03: Execution &amp; Burn
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              Acquired NFTs are sent to the dead address. 80% of yield is used
              for the sweep, while 20% is split between $LIL staking,
              compounding assets, and maintenance.
            </p>
          </div>
        </div>
      </GrungeCard>
    </LayoutPage>
  );
}
