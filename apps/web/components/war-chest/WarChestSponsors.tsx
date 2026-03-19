import { IconExternalLink } from "@/components/icons/IconExternalLink";
import { GrungeLink } from "@/components/ui/GrungeLink";
import { WarChestSponsorsGrid } from "@/components/war-chest/WarChestSponsorsGrid";
import type { Sponsor } from "@/types/Sponsor";

const sponsors: Sponsor[] = [];

export function WarChestSponsors() {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <WarChestSponsorsGrid minCards={6} sponsors={sponsors} />

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-8 py-6">
        <p className="text-sm text-zinc-400">
          Interested in sponsoring a Burn Event?
        </p>

        <GrungeLink href="#" icon={IconExternalLink} size="sm">
          Become a Sponsor
        </GrungeLink>
      </div>
    </div>
  );
}
