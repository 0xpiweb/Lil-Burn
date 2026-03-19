"use server";

import { db } from "@/db/drizzle";
import { paginate } from "@/db/paginate";
import { burn, nft } from "@/db/schema";
import type { LilBurn } from "@/types/LilBurn";
import type { Paginated } from "@/types/Paginated";
import { count, eq } from "drizzle-orm";
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

export async function getBurnedLilBurns(
  page: number,
  pageSize: number,
): Promise<Paginated<LilBurn>> {
  function filters<T extends SQLiteSelectQueryBuilder>(query: T) {
    return query.innerJoin(nft, eq(burn.tokenId, nft.tokenId));
  }

  const query = filters(
    db
      .select({
        tokenId: burn.tokenId,
        burnTransactionHash: burn.transactionHash,
        burnBlockNumber: burn.blockNumber,
        burnBlockTimestamp: burn.blockTimestamp,
        name: nft.name,
        image: nft.image,
        artist: nft.artist,
        f1r3Crew: nft.f1r3Crew,
        sweepScore: nft.sweepScore,
        cursed: nft.cursed,
        cursedMilestone: nft.cursedMilestone,
        cursedAt: nft.cursedAt,
      })
      .from(burn)
      .orderBy(burn.blockTimestamp)
      .$dynamic(),
  );

  const countQuery = filters(
    db.select({ count: count() }).from(burn).$dynamic(),
  );

  const {
    items: rows,
    total,
    totalPages,
  } = await paginate(query, countQuery, page, pageSize);

  const items: LilBurn[] = rows.map((row) => ({
    ...row,
    isCursed: row.cursed != null,
    isBurned: true,
  }));

  return { items, total, totalPages };
}
