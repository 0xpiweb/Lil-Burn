"use server";

import { db } from "@/db/drizzle";
import { paginate } from "@/db/paginate";
import { burn, nft } from "@/db/schema";
import type { LilBurn } from "@/types/LilBurn";
import type { Paginated } from "@/types/Paginated";
import { asc, count, eq } from "drizzle-orm";
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

export async function getCursedLilBurns(
  page: number,
  pageSize: number,
): Promise<Paginated<LilBurn>> {
  function filters<T extends SQLiteSelectQueryBuilder>(query: T) {
    return query.where(eq(nft.cursed, true));
  }

  const query = filters(
    db
      .select({
        tokenId: nft.tokenId,
        name: nft.name,
        image: nft.image,
        artist: nft.artist,
        f1r3Crew: nft.f1r3Crew,
        sweepScore: nft.sweepScore,
        cursed: nft.cursed,
        cursedMilestone: nft.cursedMilestone,
        cursedAt: nft.cursedAt,
        burnTransactionHash: burn.transactionHash,
        burnBlockNumber: burn.blockNumber,
        burnBlockTimestamp: burn.blockTimestamp,
      })
      .from(nft)
      .leftJoin(burn, eq(burn.tokenId, nft.tokenId))
      .orderBy(asc(nft.cursedMilestone))
      .$dynamic(),
  );

  const countQuery = filters(
    db.select({ count: count() }).from(nft).$dynamic(),
  );

  const {
    items: rows,
    total,
    totalPages,
  } = await paginate(query, countQuery, page, pageSize);

  const items: LilBurn[] = rows.map((row) => ({
    ...row,
    isCursed: true,
    isBurned: row.burnTransactionHash != null,
  }));

  return { items, total, totalPages };
}
