"use server";

import { db } from "@/db/drizzle";
import { yieldEpoch } from "@/db/schema";
import { formatNumber } from "@/lib/format";
import { sum } from "drizzle-orm";

export async function getYieldGenerated() {
  const [{ yieldGenerated }] = await db
    .select({
      yieldGenerated: sum(yieldEpoch.yieldGenerated),
    })
    .from(yieldEpoch);

  return formatNumber(Number(yieldGenerated));
}
