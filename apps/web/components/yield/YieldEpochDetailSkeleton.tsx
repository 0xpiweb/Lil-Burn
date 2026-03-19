import { GrungeCard } from "@/components/ui/GrungeCard";
import { HorizontalLine } from "../ui/HorizontalLine";

function SkeletonRow({ labelWidth = "w-24" }: { labelWidth?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <div
        className={`h-4 animate-pulse rounded bg-zinc-800/80 ${labelWidth}`}
      />

      <div className="h-5 w-20 animate-pulse rounded bg-zinc-700/60" />
    </div>
  );
}

function SkeletonSubRow() {
  return (
    <div className="flex items-baseline justify-between">
      <div className="h-4 w-48 animate-pulse rounded bg-zinc-800/80" />
      <div className="h-4 w-16 animate-pulse rounded bg-zinc-800/80" />
    </div>
  );
}

export function YieldEpochDetailSkeleton() {
  return (
    <GrungeCard className="h-150 min-w-0 grow p-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-8 w-24 animate-pulse rounded bg-zinc-700/60" />
        <div className="ml-auto h-7.5 w-20 animate-pulse rounded bg-zinc-800/80" />
      </div>

      <div className="flex flex-col gap-5">
        <HorizontalLine />

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-4 w-12 animate-pulse rounded bg-zinc-800/80" />
              <div className="h-5 w-20 animate-pulse rounded bg-zinc-700/60" />
            </div>
          ))}
        </div>

        <HorizontalLine />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <SkeletonRow />
            <SkeletonRow />
          </div>

          <div className="flex flex-col gap-1 border-l border-zinc-800 pl-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonSubRow key={i} />
            ))}
          </div>
        </div>

        <HorizontalLine />

        <div className="flex flex-col gap-1">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    </GrungeCard>
  );
}
