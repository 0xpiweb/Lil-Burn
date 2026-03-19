import { CursedAndBurnedCountStatCard } from "@/components/cursed/CursedAndBurnedCountStatCard";
import { CursedContent } from "@/components/cursed/CursedContent";
import { CursedCountStatCard } from "@/components/cursed/CursedCountStatCard";
import { CursedMilestoneProgress } from "@/components/cursed/CursedMilestoneProgress";
import { CursedNotBurnedCountStatCard } from "@/components/cursed/CursedNotBurnedCountStatCard";
import { CursedTabs } from "@/components/cursed/CursedTabs";
import { LayoutPage } from "@/components/layout/LayoutPage";
import { LayoutPageHero } from "@/components/layout/LayoutPageHero";
import { CardsRow } from "@/components/ui/CardsRow";
import { GradientText } from "@/components/ui/GradientText";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursed | Lil-Burn",
  description: "The fallen NFTs, forever cursed in the eternal burn.",
};

export default function Cursed() {
  return (
    <LayoutPage>
      <LayoutPageHero
        title={
          <>
            The <GradientText>Cursed 100</GradientText>
          </>
        }
        introduction={[
          "The fallen NFTs, forever cursed in the eternal burn. These tokens met their fate and live on in the graveyard.",
        ]}
      />

      <CursedMilestoneProgress />

      <CardsRow>
        <CursedCountStatCard />
        <CursedAndBurnedCountStatCard />
        <CursedNotBurnedCountStatCard />
      </CardsRow>

      <CursedTabs />

      <CursedContent />
    </LayoutPage>
  );
}
