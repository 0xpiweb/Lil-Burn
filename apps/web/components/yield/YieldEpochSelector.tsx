import { CompactPagination } from "@/components/ui/CompactPagination";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { formatDateUTC } from "@/lib/format";
import type { YieldEpochSummary } from "@/types/YieldEpochSummary";

const SKELETON_COUNT = 5;

export function YieldEpochSelector({
  epochs,
  selectedNumber,
  onSelect,
  page,
  totalPages,
  onPageChange,
  isLoading,
  isFetching,
}: {
  epochs: YieldEpochSummary[];
  selectedNumber: number | undefined;
  onSelect: (number: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}) {
  return (
    <GrungeCard className="flex h-75 shrink-0 flex-col sm:h-150 sm:w-56">
      <div className="flex grow flex-col gap-1 overflow-y-auto p-4 pb-4">
        {isFetching
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex h-16 animate-pulse flex-col justify-center gap-2 rounded-sm border border-transparent px-3 py-2.5"
                style={{ opacity: 1 - i * 0.18 }}
              >
                <div className="h-3.5 w-24 rounded bg-zinc-700/70" />
                <div className="h-2.5 w-32 rounded bg-zinc-700/50" />
              </div>
            ))
          : epochs.map(
              ({
                endBlockNumber,
                startBlockTimestamp,
                endBlockTimestamp,
                number,
              }) => {
                const active = endBlockNumber === null;

                return (
                  <button
                    key={number}
                    onClick={() => onSelect(number)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-sm border px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                      selectedNumber === number
                        ? active
                          ? "border-red-500 bg-red-950/50 text-white"
                          : "border-zinc-700 bg-zinc-800 text-white"
                        : active
                          ? "border-red-900/50 bg-red-950/30 text-zinc-400"
                          : "border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    }`}
                  >
                    <div>
                      <div className="font-display tracking-wide text-white">
                        Epoch #{number}
                      </div>

                      <div className="mt-0.5 font-mono text-xs text-zinc-500">
                        {formatDateUTC(startBlockTimestamp)}
                        {endBlockTimestamp != null &&
                          ` - ${formatDateUTC(endBlockTimestamp)}`}
                      </div>
                    </div>
                  </button>
                );
              },
            )}
      </div>

      {!isLoading && totalPages > 1 && (
        <CompactPagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </GrungeCard>
  );
}
