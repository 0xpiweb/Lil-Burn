"use server";

import { db } from "@/db/drizzle";
import { yieldEpoch } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { publicClient } from "@/lib/wagmi.server";
import { computePurgeAllocation } from "@/lib/yield";
import { desc, eq } from "drizzle-orm";

export async function createYieldEpoch() {
  const user = await requireAdmin();

  const [block, lastTwoEpochs] = await Promise.all([
    publicClient.getBlock(),
    db.select().from(yieldEpoch).orderBy(desc(yieldEpoch.blockNumber)).limit(2),
  ]);

  const [lastEpoch, prevEpoch] = lastTwoEpochs;

  if (lastEpoch) {
    const purgeAllocation = computePurgeAllocation(
      lastEpoch.yieldGenerated,
      lastEpoch.externalRevenue,
      prevEpoch?.rollover ?? null,
    );

    await db
      .update(yieldEpoch)
      .set({ rollover: purgeAllocation - lastEpoch.purgeTotalSpent })
      .where(eq(yieldEpoch.blockNumber, lastEpoch.blockNumber));
  }

  await db.insert(yieldEpoch).values({
    yieldGenerated: 0,
    externalRevenue: 0,
    purgeTotalSpent: 0,
    blockNumber: Number(block.number),
    blockTimestamp: new Date(Number(block.timestamp) * 1000),
    createdBy: user.address,
  });
}
