import { CardsGrid } from "@/components/ui/CardsGrid";
import { WarChestSponsorCard } from "@/components/war-chest/WarChestSponsorCard";
import { WarChestSponsorCardEmpty } from "@/components/war-chest/WarChestSponsorCardEmpty";
import type { Sponsor } from "@/types/Sponsor";

export function WarChestSponsorsGrid({
  sponsors = [],
  minCards = 9,
}: {
  sponsors?: Sponsor[];
  minCards?: number;
}) {
  const emptyCards = Math.max(0, minCards - sponsors.length);

  return (
    <CardsGrid>
      {sponsors.map((sponsor) => (
        <WarChestSponsorCard key={sponsor.name} sponsor={sponsor} />
      ))}

      {Array.from({ length: emptyCards }, (_, i) => (
        <WarChestSponsorCardEmpty key={i} />
      ))}
    </CardsGrid>
  );
}
