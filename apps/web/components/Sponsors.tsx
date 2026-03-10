"use client";

import { GrungeLink } from "@/components/GrungeLink";
import { ExternalLinkIcon } from "@/components/icons";
import { useSponsors } from "@/hooks/useSponsors";
import { SponsorsGrid } from "./SponsorsGrid";

export function Sponsors() {
  const { data: sponsors, isLoading: pending } = useSponsors();

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <SponsorsGrid minCards={9} sponsors={sponsors} pending={pending} />

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-8 py-6">
        <p className="text-sm text-zinc-400">
          Interested in sponsoring a Burn Event?
        </p>

        <GrungeLink href="#" icon={ExternalLinkIcon} size="sm">
          Become a Sponsor
        </GrungeLink>
      </div>
    </div>
  );
}
