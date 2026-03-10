import { ROW_HEIGHT } from "./LeaderboardTable";

export function LeaderboardEmptyRow({ rank }: { rank: number }) {
  return (
    <div
      className="grid grid-cols-[80px_1fr_auto] items-center border-b border-zinc-800/50 px-5 last:border-b-0"
      style={{ height: ROW_HEIGHT }}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-sm bg-zinc-800 text-xs font-bold text-zinc-600">
          {rank}
        </span>
      </div>

      <span className="font-mono text-sm text-zinc-700">—</span>

      <div className="flex flex-col items-end">
        <span className="text-lg font-black text-zinc-700">—</span>
        <span className="text-xs text-zinc-700">AVAX</span>
      </div>
    </div>
  );
}
