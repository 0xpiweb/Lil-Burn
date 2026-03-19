"use server";

import { db } from "@/db/drizzle";
import { yieldEpoch } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function updateYieldEpoch(
  blockNumber: number,
  data: {
    yieldGenerated?: number;
    externalRevenue?: number;
    purgeTotalSpent?: number;
  },
) {
  await requireAdmin();

  await db
    .update(yieldEpoch)
    .set(data)
    .where(eq(yieldEpoch.blockNumber, blockNumber));
}
