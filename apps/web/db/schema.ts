import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { address, hex, uint256 } from "./types";

export const syncState = sqliteTable("sync_state", {
  key: text("key").primaryKey(),
  value: integer("value").notNull(),
});

export const donation = sqliteTable(
  "donation",
  {
    logIndex: integer("log_index").notNull(),
    transactionHash: hex("transaction_hash").notNull(),
    blockNumber: integer("block_number").notNull(),
    blockTimestamp: integer("block_timestamp", { mode: "timestamp" }).notNull(),
    donor: address("donor").notNull(),
    epoch: integer("epoch").notNull(),
    amount: uint256("amount").notNull(),
    amountEth: real("amount_eth").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.transactionHash, table.logIndex] }),
    index("donation_epoch_idx").on(table.epoch),
    index("donation_epoch_donor_idx").on(table.epoch, table.donor),
    index("donation_donor_amount_eth_idx").on(table.donor, table.amountEth),
  ],
);

export const nft = sqliteTable(
  "nft",
  {
    tokenId: integer("token_id").primaryKey(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    artist: text("artist").notNull(),
    f1r3Crew: text("f1r3_crew").notNull(),
    sweepScore: integer("sweep_score").notNull(),
    cursed: integer("cursed", { mode: "boolean" }),
    cursedMilestone: integer("cursed_milestone"),
    cursedAt: integer("cursed_at", { mode: "timestamp" }),
  },
  (table) => [
    index("nft_cursed_milestone_idx").on(table.cursed, table.cursedMilestone),
  ],
);

export const burn = sqliteTable(
  "burn",
  {
    logIndex: integer("log_index").notNull(),
    transactionHash: hex("transaction_hash").notNull(),
    blockNumber: integer("block_number").notNull(),
    blockTimestamp: integer("block_timestamp", { mode: "timestamp" }).notNull(),
    tokenId: integer("token_id").notNull(),
    address: address("address").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.transactionHash, table.logIndex] }),
    index("burn_token_id_idx").on(table.tokenId),
    index("burn_block_number_idx").on(table.blockNumber),
    index("burn_block_timestamp_idx").on(table.blockTimestamp),
  ],
);

export const sweep = sqliteTable(
  "sweep",
  {
    logIndex: integer("log_index").notNull(),
    transactionHash: hex("transaction_hash").notNull(),
    blockNumber: integer("block_number").notNull(),
    blockTimestamp: integer("block_timestamp", { mode: "timestamp" }).notNull(),
    tokenId: integer("token_id").notNull(),
    address: address("address").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.transactionHash, table.logIndex] }),
    index("sweep_token_id_idx").on(table.tokenId),
    index("sweep_block_number_idx").on(table.blockNumber),
  ],
);

export const user = sqliteTable("user", {
  address: address("address").primaryKey(),
  role: text("role", { enum: ["admin"] }),
});

export const yieldEpoch = sqliteTable("yield_epoch", {
  yieldGenerated: real("yield_generated_eth").notNull(),
  externalRevenue: real("external_revenue_eth").notNull(),
  purgeTotalSpent: real("purge_total_spent_eth").notNull(),
  rollover: real("rollover_eth"),
  blockNumber: integer("block_number").primaryKey(),
  blockTimestamp: integer("block_timestamp", { mode: "timestamp" }).notNull(),
  createdBy: address("created_by").references(() => user.address),
});
