"use client";

import { GrungeCard } from "@/components/GrungeCard";
import { ExternalLinkIcon } from "@/components/icons";
import { type Sponsor } from "@/types/Sponsor";
import Image from "next/image";

export function SponsorCardEmpty() {
  return (
    <GrungeCard className="flex flex-col overflow-hidden rounded-sm">
      <div className="aspect-4/3 bg-zinc-900" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="text-sm font-bold text-zinc-700">—</span>
        <p className="flex-1 text-xs text-zinc-700">—</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-zinc-700 uppercase">
            Contribution
          </span>
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-700">
            — AVAX
          </span>
        </div>
      </div>
    </GrungeCard>
  );
}

export function SponsorCardSkeleton() {
  return (
    <GrungeCard className="flex flex-col overflow-hidden rounded-sm">
      <div className="aspect-4/3 animate-pulse bg-zinc-800" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-700" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-zinc-800" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 animate-pulse rounded bg-zinc-800" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-800" />
        </div>
      </div>
    </GrungeCard>
  );
}

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
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
              <ExternalLinkIcon className="size-3.5 text-zinc-500" />
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

          <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-400">
            {sponsor.contribution} AVAX
          </span>
        </div>
      </div>
    </GrungeCard>
  );
}
