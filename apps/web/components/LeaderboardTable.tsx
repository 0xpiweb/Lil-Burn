"use client";

import { GrungeCard } from "@/components/GrungeCard";
import { LeaderboardEmptyRow } from "@/components/LeaderboardEmptyRow";
import { LeaderboardRow } from "@/components/LeaderboardRow";
import { LeaderboardSkeletonRow } from "@/components/LeaderboardSkeletonRow";
import { Address, isAddressEqual } from "viem";

export const ROW_HEIGHT = 77;

export type LeaderboardEntry = {
  rank: number;
  address: Address;
  contribution: number;
};

export function LeaderboardTable({
  entries = [],
  minRows = 10,
  pending = false,
  address,
}: {
  entries?: LeaderboardEntry[];
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
            <LeaderboardSkeletonRow key={i} />
          ))
        : null}

      {!pending &&
        entries.map((entry) => (
          <LeaderboardRow
            key={entry.rank}
            entry={entry}
            isUser={address ? isAddressEqual(address, entry.address) : false}
          />
        ))}

      {!pending &&
        Array.from({ length: emptyRows }, (_, i) => (
          <LeaderboardEmptyRow key={i} rank={entries.length + i + 1} />
        ))}

      <div className="border-t border-zinc-800 py-4 text-center text-sm text-zinc-600">
        Showing top {minRows} contributors
      </div>
    </GrungeCard>
  );
}
