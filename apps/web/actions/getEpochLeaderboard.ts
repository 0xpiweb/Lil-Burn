"use server";

import type { LeaderboardEntry } from "@/components/LeaderboardTable";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getEpochLeaderboard(
  epoch: number,
): Promise<LeaderboardEntry[]> {
  const rows = await db
    .select({
      address: schema.donation.donor,
      contribution: sql<number>`sum(${schema.donation.amountEth})`,
    })
    .from(schema.donation)
    .where(eq(schema.donation.epoch, epoch))
    .groupBy(schema.donation.donor)
    .orderBy(sql`sum(${schema.donation.amountEth}) desc`)
    .limit(10)
    .execute();

  return rows.map(({ address, contribution }, i) => ({
    rank: i + 1,
    address,
    contribution: parseFloat(contribution.toPrecision(15)),
  }));
}
