import { HEIGHT } from "./CursedMilestoneProgress";

export function MintProgressSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3" style={{ height: HEIGHT }}>
      <div className="flex items-center justify-between">
        <div className="h-5 w-28 animate-pulse rounded bg-zinc-700/60" />
        <div className="h-5 w-16 animate-pulse rounded bg-zinc-800/80" />
      </div>

      <div className="h-3 w-full overflow-hidden rounded-sm bg-zinc-800">
        <div className="h-full w-0 bg-zinc-700" />
      </div>

      <div className="mx-auto h-5 w-24 animate-pulse rounded bg-zinc-800/60" />
    </div>
  );
}
