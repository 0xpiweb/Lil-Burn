import { GradientText } from "@/components/GradientText";
import { MintControls } from "@/components/MintControls";
import { MintControlsSkeleton } from "@/components/MintControlsSkeleton";
import { MintPhaseCards } from "@/components/MintPhaseCards";
import { MintPhaseCardsSkeleton } from "@/components/MintPhaseCardsSkeleton";
import { MintProgress } from "@/components/MintProgress";
import { MintProgressSkeleton } from "@/components/MintProgressSkeleton";
import { Page } from "@/components/Page";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mint | Lil-Burn",
  description:
    "Step into the heat. Claim your Lil-Burn NFT. Only the worthy survive.",
};

export default function Mint() {
  return (
    <Page className="max-w-2xl">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-4xl font-black text-white uppercase sm:text-5xl">
          The <GradientText>Ignition Point</GradientText>
        </h1>

        <p className="text-sm text-zinc-400">
          Step into the heat. Claim your Lil-Burn NFT. Only the worthy survive.
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-display text-2xl font-bold tracking-wide text-white">
            Mint Phases
          </h2>

          <p className="text-xs text-zinc-500">Watch the supply melt</p>
        </div>

        <Suspense fallback={<MintPhaseCardsSkeleton />}>
          <MintPhaseCards />
        </Suspense>
      </div>

      <Suspense fallback={<MintControlsSkeleton />}>
        <MintControls />
      </Suspense>

      <Suspense fallback={<MintProgressSkeleton />}>
        <MintProgress />
      </Suspense>
    </Page>
  );
}
