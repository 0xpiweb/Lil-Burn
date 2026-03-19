import { FOOTER_HEIGHT } from "@/components/nft/NftCard";
import { GrungeCard } from "@/components/ui/GrungeCard";

export function NftCardSkeleton() {
  return (
    <GrungeCard className="overflow-hidden rounded-sm">
      <div className="aspect-square animate-pulse bg-zinc-800" />

      <div
        className="flex items-center justify-between px-3"
        style={{ height: FOOTER_HEIGHT }}
      >
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-700" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-800" />
      </div>
    </GrungeCard>
  );
}
