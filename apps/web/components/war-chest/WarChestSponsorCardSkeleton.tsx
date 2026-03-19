import { GrungeCard } from "@/components/ui/GrungeCard";

export function WarChestSponsorCardSkeleton() {
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
