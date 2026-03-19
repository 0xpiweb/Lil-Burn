import { GrungeCard } from "@/components/ui/GrungeCard";

export function WarChestSponsorCardEmpty() {
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
