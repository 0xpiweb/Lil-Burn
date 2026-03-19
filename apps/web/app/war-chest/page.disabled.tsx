import { LayoutPage } from "@/components/layout/LayoutPage";
import { LayoutPageHero } from "@/components/layout/LayoutPageHero";
import { GradientText } from "@/components/ui/GradientText";
import { WarChestContent } from "@/components/war-chest/WarChestContent";
import { WarChestDonateCard } from "@/components/war-chest/WarChestDonateCard";
import { WarChestEpochInfoBadge } from "@/components/war-chest/WarChestEpochInfoBadge";
import { WarChestStatCards } from "@/components/war-chest/WarChestStatCards";
import { WarChestTabs } from "@/components/war-chest/WarChestTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "War Chest | Lil-Burn",
  description:
    "Lil-Burn's strategic reserve—a community-funded treasury fueling the hyper-deflationary burn mechanism.",
};

export default function WarChestPage() {
  return (
    <LayoutPage>
      <WarChestEpochInfoBadge />

      <LayoutPageHero
        title={
          <>
            War <GradientText>Chest</GradientText>
          </>
        }
        introduction={[
          <>
            The War Chest is the community-funded engine of the Lil-Burn
            ecosystem. Unlike the Yield Engine which operates on protocol
            revenue, the War Chest is a transparent, public wallet fueled by
            direct contributions and external sponsorships.
          </>,
          <>
            Every $AVAX contributed to the War Chest is used to market-buy
            Lil-Burn NFTs and send them to the dead address. It is a tactical
            weapon used to accelerate the burn timeline and force milestone
            reveals.
          </>,
        ]}
      />

      <WarChestStatCards />

      <WarChestDonateCard />

      <WarChestTabs />

      <WarChestContent />
    </LayoutPage>
  );
}
