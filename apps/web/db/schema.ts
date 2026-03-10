import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";
import { address, hex, uint256 } from "./types";

export const syncState = sqliteTable("sync_state", {
  key: text("key").primaryKey(),
  value: integer("value").notNull(),
});

export const donation = sqliteTable(
  "donation",
  {
    id: text("id").primaryKey().$defaultFn(randomUUID),
    txHash: hex("tx_hash").notNull(),
    logIndex: integer("log_index").notNull(),
    donor: address("donor").notNull(),
    epoch: integer("epoch").notNull(),
    amountWei: uint256("amount_wei").notNull(),
    amountEth: real("amount_eth").notNull(),
    blockNumber: integer("block_number").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    unique().on(table.txHash, table.logIndex),
    index("donation_epoch_idx").on(table.epoch),
    index("donation_epoch_donor_idx").on(table.epoch, table.donor),
    index("donation_donor_amount_idx").on(table.donor, table.amountEth),
  ],
);
