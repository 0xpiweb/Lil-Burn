"use client";

import { Sponsor } from "@/types/Sponsor";
import {
  SponsorCard,
  SponsorCardEmpty,
  SponsorCardSkeleton,
} from "./SponsorCard";

export function SponsorsGrid({
  sponsors = [],
  minCards = 9,
  pending,
}: {
  sponsors?: Sponsor[];
  minCards?: number;
  pending?: boolean;
}) {
  const emptyCards = Math.max(0, minCards - sponsors.length);

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {pending
        ? Array.from({ length: minCards }, (_, i) => (
            <SponsorCardSkeleton key={i} />
          ))
        : null}

      {!pending &&
        sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}

      {!pending &&
        Array.from({ length: emptyCards }, (_, i) => (
          <SponsorCardEmpty key={i} />
        ))}
    </div>
  );
}
