import { FOOTER_HEIGHT } from "@/components/nft/NftCard";
import { GrungeCard } from "@/components/ui/GrungeCard";

export function NftCardEmpty({ variant }: { variant?: "burned" | "cursed" }) {
  return (
    <GrungeCard className="overflow-hidden rounded-sm opacity-50">
      <div className="flex aspect-square items-center justify-center bg-zinc-900">
        {variant === "cursed" && (
          <span className="font-display text-6xl font-black text-zinc-600 select-none">
            ?
          </span>
        )}
      </div>

      <div
        className="flex items-center justify-between px-3"
        style={{ height: FOOTER_HEIGHT }}
      >
        <span className="text-sm font-semibold text-zinc-700">—</span>

        {variant === "cursed" && (
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-700">
            —
          </span>
        )}
      </div>
    </GrungeCard>
  );
}
