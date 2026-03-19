import { Badge } from "@/components/ui/Badge";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { formatDateUTC, formatNumber } from "@/lib/format";
import { computePurgeAllocation } from "@/lib/yield";
import type { YieldEpochDetail as YieldEpochDetailType } from "@/types/YieldEpochDetail";
import { HorizontalLine } from "../ui/HorizontalLine";
import { YieldEpochDetailDetailCell } from "./YieldEpochDetailCell";
import { YieldEpochDetailNftBadges } from "./YieldEpochDetailNftBadges";
import { YieldEpochDetailDetailRow } from "./YieldEpochDetailRow";
import { YieldEpochDetailSubDetailRow } from "./YieldEpochDetailSubDetailRow";

export function YieldEpochDetail({
  epoch,
  maxSupply,
}: {
  epoch: YieldEpochDetailType;
  maxSupply: number;
}) {
  const remaining = maxSupply - epoch.totalBurnsAtEnd;

  const deflationRate = ((epoch.totalBurnsAtEnd / maxSupply) * 100).toFixed(1);

  const purgeAllocation = computePurgeAllocation(
    epoch.yieldGenerated,
    epoch.externalRevenue,
    epoch.incomingRollover,
  );

  const isActive = epoch.endBlockNumber === null;

  return (
    <GrungeCard className="flex h-150 grow flex-col">
      <div className="overflow-y-auto p-4">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl tracking-wide text-white uppercase">
            Epoch #{epoch.number}
          </h2>

          {epoch.endBlockNumber === null && <Badge>Active</Badge>}
        </div>

        <div className="flex flex-col gap-5">
          <HorizontalLine />

          <div className="grid grid-cols-3 gap-3">
            <YieldEpochDetailDetailCell
              label="Start"
              value={formatDateUTC(epoch.startBlockTimestamp)}
            />

            <YieldEpochDetailDetailCell
              label="End"
              value={
                epoch.endBlockTimestamp
                  ? formatDateUTC(epoch.endBlockTimestamp)
                  : "—"
              }
            />

            <YieldEpochDetailDetailCell
              label="Remaining Lil-B"
              value={
                <>
                  {remaining}
                  <span className="ml-1 text-xs text-zinc-600">
                    ({deflationRate}% burned)
                  </span>
                </>
              }
            />
          </div>

          <HorizontalLine />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <YieldEpochDetailDetailRow
                label="Yield Generated"
                value={formatNumber(epoch.yieldGenerated)}
                unit="$AVAX"
              />

              <YieldEpochDetailDetailRow
                label="External Revenue"
                value={formatNumber(epoch.externalRevenue)}
                unit="$AVAX"
              />

              {epoch.incomingRollover != null && (
                <YieldEpochDetailDetailRow
                  label="Incoming Rollover"
                  value={formatNumber(epoch.incomingRollover)}
                  unit="$AVAX"
                />
              )}
            </div>

            <div className="flex flex-col gap-1 border-l border-zinc-800 pl-3">
              <YieldEpochDetailSubDetailRow
                label="Purge Allocation (80% + Revenue + Rollover)"
                value={formatNumber(purgeAllocation)}
                unit="$AVAX"
              />

              <YieldEpochDetailSubDetailRow
                label="Lil Coq (5%)"
                value={formatNumber(epoch.yieldGenerated * 0.05)}
                unit="$AVAX"
              />

              <YieldEpochDetailSubDetailRow
                label="$LIL Token (5%)"
                value={formatNumber(epoch.yieldGenerated * 0.05)}
                unit="$AVAX"
              />

              <YieldEpochDetailSubDetailRow
                label="Team Allocation (10%)"
                value={formatNumber(epoch.yieldGenerated * 0.1)}
                unit="$AVAX"
              />
            </div>
          </div>

          <HorizontalLine />

          <div className="flex flex-col gap-1">
            <YieldEpochDetailDetailRow
              label="Purge Total Spent"
              value={formatNumber(epoch.purgeTotalSpent)}
              unit="$AVAX"
            />

            <YieldEpochDetailDetailRow
              label={isActive ? "Rollover (estimated)" : "Rollover"}
              value={formatNumber(epoch.rollover)}
              unit="$AVAX"
            />
          </div>

          {epoch.sweeps.length > 0 && (
            <YieldEpochDetailNftBadges
              nfts={epoch.sweeps}
              qualifier="swept"
              variant="cursed"
            />
          )}

          {epoch.burns.length > 0 && (
            <YieldEpochDetailNftBadges
              nfts={epoch.burns}
              qualifier="burned"
              variant="burned"
            />
          )}
        </div>
      </div>
    </GrungeCard>
  );
}
