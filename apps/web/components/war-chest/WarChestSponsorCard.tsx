import { IconExternalLink } from "@/components/icons/IconExternalLink";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { Pill } from "@/components/ui/Pill";
import { type Sponsor } from "@/types/Sponsor";
import Image from "next/image";

export function WarChestSponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <GrungeCard className="flex flex-col overflow-hidden rounded-sm">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={sponsor.image}
          alt={sponsor.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          {sponsor.url ? (
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-sm text-sm font-bold text-white hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
            >
              <h3>{sponsor.name}</h3>

              <IconExternalLink className="size-3.5 text-zinc-500" />
            </a>
          ) : (
            <h3 className="text-sm font-bold text-white">{sponsor.name}</h3>
          )}
        </div>

        <p className="flex-1 text-xs leading-relaxed text-zinc-400">
          {sponsor.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            Contribution
          </span>

          <Pill>{sponsor.contribution} AVAX</Pill>
        </div>
      </div>
    </GrungeCard>
  );
}
