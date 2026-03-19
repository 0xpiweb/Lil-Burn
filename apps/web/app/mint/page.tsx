import { LayoutPage } from "@/components/layout/LayoutPage";
import { LayoutPageHero } from "@/components/layout/LayoutPageHero";
import { MintControls } from "@/components/mint/MintControls";
import { MintPhaseCards } from "@/components/mint/MintPhaseCards";
import { MintProgress } from "@/components/mint/MintProgress";
import { GradientText } from "@/components/ui/GradientText";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mint | Lil-Burn",
  description:
    "Step into the heat. Claim your Lil-Burn NFT. Only the worthy survive.",
};

export default function Mint() {
  return (
    <LayoutPage className="max-w-2xl">
      <LayoutPageHero
        title={
          <>
            The <GradientText>Ignition Point</GradientText>
          </>
        }
        introduction={[
          "Step into the heat. Claim your Lil-Burn NFT. Only the worthy survive.",
        ]}
      />

      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-display text-2xl font-bold tracking-wide text-white">
            Mint Phases
          </h2>

          <p className="text-xs text-zinc-500">Watch the supply melt</p>
        </div>

        <MintPhaseCards />
      </div>

      <MintControls />

      <MintProgress />
    </LayoutPage>
  );
}
