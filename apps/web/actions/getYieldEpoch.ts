"use server";

import { db } from "@/db/drizzle";
import { burn, sweep, yieldEpoch } from "@/db/schema";
import { computePurgeAllocation } from "@/lib/yield";
import type { YieldEpochDetail } from "@/types/YieldEpochDetail";
import type { YieldEpochSummary } from "@/types/YieldEpochSummary";
import { and, asc, count, gte, lt } from "drizzle-orm";

export async function getYieldEpoch(
  epochNumber: number,
): Promise<YieldEpochDetail | null> {
  const rows = await db
    .select()
    .from(yieldEpoch)
    .orderBy(asc(yieldEpoch.blockNumber))
    .limit(epochNumber === 1 ? 2 : 3)
    .offset(Math.max(0, epochNumber - 2));

  const [prevEpoch, epoch, nextEpoch] =
    epochNumber === 1 ? [undefined, rows[0], rows[1]] : rows;

  if (!epoch) {
    return null;
  }

  const incomingRollover = prevEpoch?.rollover ?? null;

  const purgeAllocation = computePurgeAllocation(
    epoch.yieldGenerated,
    epoch.externalRevenue,
    incomingRollover,
  );

  const rollover = epoch.rollover ?? purgeAllocation - epoch.purgeTotalSpent;

  const summary: YieldEpochSummary = {
    number: epochNumber,
    startBlockNumber: epoch.blockNumber,
    startBlockTimestamp: epoch.blockTimestamp,
    endBlockNumber: nextEpoch?.blockNumber ?? null,
    endBlockTimestamp: nextEpoch?.blockTimestamp ?? null,
    yieldGenerated: epoch.yieldGenerated,
    externalRevenue: epoch.externalRevenue,
    purgeTotalSpent: epoch.purgeTotalSpent,
  };

  const [epochBurns, epochSweeps, [{ totalBurnsAtEnd }]] = await Promise.all([
    db
      .select({
        tokenId: burn.tokenId,
        transactionHash: burn.transactionHash,
        blockNumber: burn.blockNumber,
        blockTimestamp: burn.blockTimestamp,
      })
      .from(burn)
      .where(
        and(
          gte(burn.blockNumber, summary.startBlockNumber),
          summary.endBlockNumber != null
            ? lt(burn.blockNumber, summary.endBlockNumber)
            : undefined,
        ),
      ),
    db
      .select({
        tokenId: sweep.tokenId,
        transactionHash: sweep.transactionHash,
        blockNumber: sweep.blockNumber,
        blockTimestamp: sweep.blockTimestamp,
      })
      .from(sweep)
      .where(
        and(
          gte(sweep.blockNumber, summary.startBlockNumber),
          summary.endBlockNumber != null
            ? lt(sweep.blockNumber, summary.endBlockNumber)
            : undefined,
        ),
      ),
    db
      .select({ totalBurnsAtEnd: count() })
      .from(burn)
      .where(
        summary.endBlockNumber != null
          ? lt(burn.blockNumber, summary.endBlockNumber)
          : undefined,
      ),
  ]);

  return {
    ...summary,
    rollover,
    incomingRollover,
    totalBurnsAtEnd,
    burns: epochBurns,
    sweeps: epochSweeps,
  };
}
