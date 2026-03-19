"use server";

import { db } from "@/db/drizzle";
import { donation } from "@/db/schema";
import { formatNumber } from "@/lib/format";
import { count, countDistinct, eq, sum } from "drizzle-orm";

export async function getWarChestInfos(epoch: number | null) {
  const query = db
    .select({
      donationCount: count(),
      donorCount: countDistinct(donation.donor),
      totalAmount: sum(donation.amountEth),
    })
    .from(donation);

  const [result] = await (epoch !== null
    ? query.where(eq(donation.epoch, epoch))
    : query);

  return {
    donationCount: result.donationCount,
    donorCount: result.donorCount,
    totalAmount: result.totalAmount
      ? formatNumber(Number(result.totalAmount))
      : 0,
  };
}
