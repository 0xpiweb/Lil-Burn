"use server";

import { db } from "@/db/drizzle";
import { paginate } from "@/db/paginate";
import { yieldEpoch } from "@/db/schema";
import type { Paginated } from "@/types/Paginated";
import type { YieldEpochSummary } from "@/types/YieldEpochSummary";
import { asc, count, desc, gt } from "drizzle-orm";

export async function getYieldEpochs(
  page: number,
  pageSize: number,
): Promise<Paginated<YieldEpochSummary>> {
  const query = db
    .select()
    .from(yieldEpoch)
    .orderBy(desc(yieldEpoch.blockNumber))
    .$dynamic();

  const countQuery = db.select({ count: count() }).from(yieldEpoch).$dynamic();

  const {
    items: epochs,
    total,
    totalPages,
  } = await paginate(query, countQuery, page, pageSize);

  // check first epoch (might be the active one, without a next block number/timestamp)
  const [nextEpoch] = epochs.length
    ? await db
        .select()
        .from(yieldEpoch)
        .where(gt(yieldEpoch.blockNumber, epochs[0].blockNumber))
        .orderBy(asc(yieldEpoch.blockNumber))
        .limit(1)
    : [];

  const items: YieldEpochSummary[] = epochs.map((epoch, i) => {
    // i - 1 since the epochs are in decreasing order
    const next = i === 0 ? nextEpoch : epochs[i - 1];

    return {
      number: total - (page * pageSize - (pageSize - i)),
      startBlockNumber: epoch.blockNumber,
      startBlockTimestamp: epoch.blockTimestamp,
      endBlockNumber: next?.blockNumber ?? null,
      endBlockTimestamp: next?.blockTimestamp ?? null,
      yieldGenerated: epoch.yieldGenerated,
      externalRevenue: epoch.externalRevenue,
      purgeTotalSpent: epoch.purgeTotalSpent,
    };
  });

  return { items, total, totalPages };
}
