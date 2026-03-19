import { GrungeCard } from "@/components/ui/GrungeCard";
import { WarChestLeaderboardRow } from "@/components/war-chest/WarChestLeaderboardRow";
import { WarChestLeaderboardRowEmpty } from "@/components/war-chest/WarChestLeaderboardRowEmpty";
import { WarChestLeaderboardRowSkeleton } from "@/components/war-chest/WarChestLeaderboardRowSkeleton";
import type { WarChestLeaderboardEntry } from "@/types/WarChestLeaderboardEntry";
import { isAddressEqual, type Address } from "viem";

export const ROW_HEIGHT = 77;

export function WarChestLeaderboard({
  entries = [],
  minRows = 10,
  pending = false,
  address,
}: {
  entries?: WarChestLeaderboardEntry[];
  minRows?: number;
  pending?: boolean;
  address?: Address;
}) {
  const emptyRows = Math.max(0, minRows - entries.length);

  return (
    <GrungeCard className="w-full overflow-hidden rounded-sm">
      <div className="grid grid-cols-[80px_1fr_auto] items-center border-b border-zinc-800 bg-zinc-900/40 px-5 py-3">
        <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          Rank
        </span>

        <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          Wallet Address
        </span>

        <span className="text-right text-xs font-bold tracking-wider text-zinc-500 uppercase">
          Contribution
        </span>
      </div>

      {pending
        ? Array.from({ length: minRows }, (_, i) => (
            <WarChestLeaderboardRowSkeleton key={i} />
          ))
        : null}

      {!pending &&
        entries.map((entry) => (
          <WarChestLeaderboardRow
            key={entry.rank}
            entry={entry}
            isUser={address ? isAddressEqual(address, entry.address) : false}
          />
        ))}

      {!pending &&
        Array.from({ length: emptyRows }, (_, i) => (
          <WarChestLeaderboardRowEmpty key={i} rank={entries.length + i + 1} />
        ))}
    </GrungeCard>
  );
}
