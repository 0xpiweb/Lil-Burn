"use server";

import { db } from "@/db/drizzle";
import { burn, nft } from "@/db/schema";
import type { LilBurn } from "@/types/LilBurn";
import { eq } from "drizzle-orm";

export async function getLilBurn(tokenId: number): Promise<LilBurn | null> {
  const [row] = await db
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
    .where(eq(nft.tokenId, tokenId))
    .limit(1)
    .execute();

  if (!row) {
    return null;
  }

  return {
    ...row,
    isCursed: row.cursed != null,
    isBurned: row.burnTransactionHash != null,
  };
}
