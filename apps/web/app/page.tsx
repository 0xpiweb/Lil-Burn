import { LayoutPage } from "@/components/layout/LayoutPage";
import { GradientText } from "@/components/ui/GradientText";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { GrungeLink } from "@/components/ui/GrungeLink";
import Image from "next/image";

export default function Home() {
  return (
    <LayoutPage className="flex-row items-center gap-8 lg:flex-row">
      <div className="flex w-full flex-1 flex-col gap-8">
        <div>
          <h1 className="font-display text-7xl leading-none font-black tracking-wide text-white uppercase">
            Survive
            <br />
            The <GradientText>Burn</GradientText>
          </h1>
        </div>

        <div className="flex flex-col gap-4 text-sm text-zinc-400">
          <p>Lil-Burn is a high-stakes experiment on Avalanche.</p>

          <p>
            Our hyper-deflationary mechanics have one goal: Shrink the supply
            until only the diamond-handed remain.
          </p>

          <p>Will you be part of the Final 100?</p>
        </div>

        <div className="flex items-center gap-6">
          <GrungeLink href="/mint" size="sm">
            Mint Now &rarr;
          </GrungeLink>

          <GrungeLink
            href="https://lil-ecosystem.gitbook.io/lil-burn"
            target="_blank"
            rel="noopener noreferrer"
            active={false}
            size="sm"
          >
            Read Whitepaper
          </GrungeLink>
        </div>
      </div>

      <div className="hidden flex-1 md:block">
        <GrungeCard className="relative aspect-square overflow-hidden rounded-sm border-2 glow-border-red border-red-800">
          <Image
            src="/cover.png"
            alt="Lil-Burn NFT"
            fill
            className="object-cover"
          />
        </GrungeCard>
      </div>
    </LayoutPage>
  );
}
