"use server";

import { db } from "@/db/drizzle";
import { yieldEpoch } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function deleteYieldEpoch(blockNumber: number) {
  await requireAdmin();

  await db.delete(yieldEpoch).where(eq(yieldEpoch.blockNumber, blockNumber));
}
