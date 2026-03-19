"use server";

import { db } from "@/db/drizzle";
import { burn, nft } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function getCursedStats() {
  const [[totalRow], [burnedRow]] = await Promise.all([
    db.select({ count: count() }).from(nft).where(eq(nft.cursed, true)),
    db
      .select({ count: count() })
      .from(nft)
      .innerJoin(burn, eq(burn.tokenId, nft.tokenId))
      .where(eq(nft.cursed, true)),
  ]);

  const total = totalRow?.count ?? 0;
  const cursedAndBurned = burnedRow?.count ?? 0;
  const cursedNotBurned = total - cursedAndBurned;

  return { total, cursedAndBurned, cursedNotBurned };
}
