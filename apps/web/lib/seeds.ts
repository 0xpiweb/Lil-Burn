import "server-only";

import { count, eq, sql } from "drizzle-orm";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { getAddress, isAddress } from "viem";
import { db } from "../db/drizzle";
import { nft, syncState, user, yieldEpoch } from "../db/schema";
import { computePurgeAllocation } from "../lib/yield";

export async function seed() {
  await Promise.all([seedNfts(), seedAdmins(), seedYieldEpoches()]);
}

const CURSED_MILESTONE = 0;
const CURSED_MILESTONE_SYNC_KEY = "lilBurn.cursedMilestone";

async function seedNfts() {
  const current = await db.query.syncState.findFirst({
    where: eq(syncState.key, CURSED_MILESTONE_SYNC_KEY),
  });

  if (current?.value === CURSED_MILESTONE) {
    return console.log(
      `[db] NFT seed is up to date (milestone ${CURSED_MILESTONE}), skipping`,
    );
  }

  const metadataDir = join(process.cwd(), "public/metadata");

  const records = readdirSync(metadataDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const tokenId = parseInt(file.replace(".json", ""), 10);

      const data = JSON.parse(readFileSync(join(metadataDir, file), "utf-8"));

      function attribute(traitType: string) {
        return data.attributes.find(
          (attribute: { trait_type: string; value: unknown }) =>
            attribute.trait_type === traitType,
        )?.value;
      }

      return {
        tokenId,
        name: data.name as string,
        image: data.image as string,
        artist: String(attribute("Artist") ?? ""),
        f1r3Crew: String(attribute("F1R3 Crew") ?? ""),
        sweepScore: Number(attribute("Sweep Score") ?? 0),
        cursed:
          typeof attribute("Cursed") === "boolean" ? attribute("Cursed") : null,
        cursedMilestone:
          typeof attribute("Cursed") === "boolean" ? CURSED_MILESTONE : null,
        cursedAt: typeof attribute("Cursed") === "boolean" ? new Date() : null,
      };
    });

  await db.transaction(async (tx) => {
    await tx
      .insert(nft)
      .values(records)
      .onConflictDoUpdate({
        target: nft.tokenId,
        set: {
          name: sql.raw(`excluded.${nft.name.name}`),
          image: sql.raw(`excluded.${nft.image.name}`),
          artist: sql.raw(`excluded.${nft.artist.name}`),
          f1r3Crew: sql.raw(`excluded.${nft.f1r3Crew.name}`),
          sweepScore: sql.raw(`excluded.${nft.sweepScore.name}`),
          cursed: sql`CASE WHEN ${nft.cursedMilestone} IS NULL AND excluded.${sql.raw(nft.cursed.name)} IS NOT NULL THEN excluded.${sql.raw(nft.cursed.name)} ELSE ${nft.cursed} END`,
          cursedMilestone: sql`CASE WHEN ${nft.cursedMilestone} IS NULL AND excluded.${sql.raw(nft.cursed.name)} IS NOT NULL THEN ${CURSED_MILESTONE} ELSE ${nft.cursedMilestone} END`,
          cursedAt: sql`CASE WHEN ${nft.cursedMilestone} IS NULL AND excluded.${sql.raw(nft.cursed.name)} IS NOT NULL THEN unixepoch() ELSE ${nft.cursedAt} END`,
        },
      });

    await tx
      .insert(syncState)
      .values({ key: CURSED_MILESTONE_SYNC_KEY, value: CURSED_MILESTONE })
      .onConflictDoUpdate({
        target: syncState.key,
        set: { value: CURSED_MILESTONE },
      });

    const [{ revealed }] = await tx
      .select({ revealed: count() })
      .from(nft)
      .where(eq(nft.cursedMilestone, CURSED_MILESTONE));

    console.log(
      `[db] Seeded ${records.length} NFTs (milestone ${CURSED_MILESTONE}, ${revealed} revealed)`,
    );
  });
}

async function seedAdmins() {
  const addresses = process.env.ADMIN_ADDRESSES?.split(",")
    .map((address) => address.trim())
    .filter((address) => isAddress(address, { strict: false }))
    .map((address) => getAddress(address));

  if (!addresses?.length) {
    return console.log();
  }

  const { rowsAffected } = await db
    .insert(user)
    .values(
      addresses.map((address) => ({
        address,
        role: "admin",
      })) satisfies (typeof user.$inferInsert)[],
    )
    .onConflictDoUpdate({
      target: user.address,
      set: { role: "admin" },
    });

  console.log(
    `[db] Seeded ${rowsAffected} ${rowsAffected > 1 ? "admins" : "admin"}`,
  );
}

async function seedYieldEpoches() {
  const epoch1Data = {
    yieldGenerated: 38.39,
    externalRevenue: 0,
    purgeTotalSpent: 30.59,
  };

  const epoch1Purge = computePurgeAllocation(
    epoch1Data.yieldGenerated,
    epoch1Data.externalRevenue,
    null,
  );

  const epoch1Rollover = epoch1Purge - epoch1Data.purgeTotalSpent;

  const epoch2Data = {
    yieldGenerated: 25.38,
    externalRevenue: 9.02,
    purgeTotalSpent: 0,
  };

  if (process.env.NEXT_PUBLIC_CHAIN === "avalanche") {
    const { rowsAffected } = await db
      .insert(yieldEpoch)
      .values([
        // March 6 (0:01) - 2026-03-06T00:01:00.000Z
        {
          blockNumber: 79663887,
          blockTimestamp: new Date(1772755260 * 1000),
          ...epoch1Data,
          rollover: epoch1Rollover,
        },
        // March 13 (0:01) - 2026-03-13T00:01:00.000Z
        {
          blockNumber: 80245043,
          blockTimestamp: new Date(1773360060 * 1000),
          ...epoch2Data,
        },
        // block not available yet
        // March 20 (0:01) - 2026-03-20T00:01:00.000Z
      ])
      .onConflictDoNothing();

    console.log(
      `[db] Seeded ${rowsAffected} yield ${rowsAffected > 1 ? "epochs" : "epoch"}`,
    );
  } else if (process.env.NEXT_PUBLIC_CHAIN === "avalancheFuji") {
    const { rowsAffected } = await db
      .insert(yieldEpoch)
      .values([
        // March 6 (0:01) - 2026-03-06T00:01:00.000Z
        {
          blockNumber: 52401708,
          blockTimestamp: new Date(1772755262 * 1000),
          ...epoch1Data,
          rollover: epoch1Rollover,
        },
        // March 13 (0:01) - 2026-03-13T00:01:00.000Z
        {
          blockNumber: 52675790,
          blockTimestamp: new Date(1773360060 * 1000),
          ...epoch2Data,
        },
        // block not available yet
        // March 20 (0:01) - 2026-03-20T00:01:00.000Z
      ])
      .onConflictDoNothing();

    console.log(
      `[db] Seeded ${rowsAffected} yield ${rowsAffected > 1 ? "epochs" : "epoch"}`,
    );
  }
}
