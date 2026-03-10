"use client";

import { MedalIcon, RibbonIcon, TrophyIcon } from "@/components/icons";
import {
  ROW_HEIGHT,
  type LeaderboardEntry,
} from "@/components/LeaderboardTable";
import { twJoin } from "@/lib/tw";
import { truncateAddress } from "@/utils/truncateAddress";
import { ComponentType } from "react";

const RANK_ICON: {
  [rank: number]: ComponentType<{ className?: string }> | undefined;
} = { 1: TrophyIcon, 2: MedalIcon, 3: RibbonIcon };

const RANK_BACKGROUND: {
  [rank: number]: string | undefined;
} = {
  1: "bg-yellow-500",
  2: "bg-zinc-400",
  3: "bg-amber-600",
};

const RANK_ICON_COLOR: {
  [rank: number]: string | undefined;
} = { 1: "text-yellow-500", 2: "text-zinc-400", 3: "text-amber-600" };

export function LeaderboardRow({
  entry,
  isUser,
}: {
  entry: LeaderboardEntry;
  isUser: boolean;
}) {
  const isTop3 = entry.rank <= 3;

  const Icon = RANK_ICON[entry.rank];

  const rankBackground = RANK_BACKGROUND[entry.rank];

  const rankIconColor = RANK_ICON_COLOR[entry.rank];

  return (
    <div
      className="grid grid-cols-[80px_1fr_auto] items-center border-b border-zinc-800/50 px-5 last:border-b-0"
      style={{ height: ROW_HEIGHT }}
    >
      <div className="flex items-center gap-3">
        <span
          className={twJoin(
            "flex size-7 items-center justify-center rounded-sm text-xs font-bold",
            rankBackground ?? "bg-zinc-800",
            isTop3 ? "text-white" : "text-zinc-400",
          )}
        >
          {entry.rank}
        </span>

        {Icon && (
          <Icon className={twJoin("hidden size-5 sm:block", rankIconColor)} />
        )}
      </div>

      <span
        className={twJoin(
          "font-mono text-sm",
          isUser ? "font-bold text-red-500" : "text-zinc-300",
        )}
      >
        {truncateAddress(entry.address)}

        {isUser && (
          <span className="ml-2 font-sans font-normal text-red-500">(you)</span>
        )}
      </span>

      <div className="flex flex-col items-end">
        <span
          className={twJoin(
            "text-lg font-black",
            isTop3 ? "text-red-500" : "text-white",
          )}
        >
          {entry.contribution}
        </span>

        <span className="text-xs text-zinc-500">AVAX</span>
      </div>
    </div>
  );
}
