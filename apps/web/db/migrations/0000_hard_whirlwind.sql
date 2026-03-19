CREATE TABLE `burn` (
	`log_index` integer NOT NULL,
	`transaction_hash` text NOT NULL,
	`block_number` integer NOT NULL,
	`block_timestamp` integer NOT NULL,
	`token_id` integer NOT NULL,
	`address` text NOT NULL,
	PRIMARY KEY(`transaction_hash`, `log_index`)
);
--> statement-breakpoint
CREATE INDEX `burn_token_id_idx` ON `burn` (`token_id`);--> statement-breakpoint
CREATE INDEX `burn_block_number_idx` ON `burn` (`block_number`);--> statement-breakpoint
CREATE INDEX `burn_block_timestamp_idx` ON `burn` (`block_timestamp`);--> statement-breakpoint
CREATE TABLE `donation` (
	`log_index` integer NOT NULL,
	`transaction_hash` text NOT NULL,
	`block_number` integer NOT NULL,
	`block_timestamp` integer NOT NULL,
	`donor` text NOT NULL,
	`epoch` integer NOT NULL,
	`amount` text NOT NULL,
	`amount_eth` real NOT NULL,
	PRIMARY KEY(`transaction_hash`, `log_index`)
);
--> statement-breakpoint
CREATE INDEX `donation_epoch_idx` ON `donation` (`epoch`);--> statement-breakpoint
CREATE INDEX `donation_epoch_donor_idx` ON `donation` (`epoch`,`donor`);--> statement-breakpoint
CREATE INDEX `donation_donor_amount_eth_idx` ON `donation` (`donor`,`amount_eth`);--> statement-breakpoint
CREATE TABLE `nft` (
	`token_id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL,
	`artist` text NOT NULL,
	`f1r3_crew` text NOT NULL,
	`sweep_score` integer NOT NULL,
	`cursed` integer,
	`cursed_milestone` integer,
	`cursed_at` integer
);
--> statement-breakpoint
CREATE INDEX `nft_cursed_milestone_idx` ON `nft` (`cursed`,`cursed_milestone`);--> statement-breakpoint
CREATE TABLE `sweep` (
	`log_index` integer NOT NULL,
	`transaction_hash` text NOT NULL,
	`block_number` integer NOT NULL,
	`block_timestamp` integer NOT NULL,
	`token_id` integer NOT NULL,
	`address` text NOT NULL,
	PRIMARY KEY(`transaction_hash`, `log_index`)
);
--> statement-breakpoint
CREATE INDEX `sweep_token_id_idx` ON `sweep` (`token_id`);--> statement-breakpoint
CREATE INDEX `sweep_block_number_idx` ON `sweep` (`block_number`);--> statement-breakpoint
CREATE TABLE `sync_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`address` text PRIMARY KEY NOT NULL,
	`role` text
);
--> statement-breakpoint
CREATE TABLE `yield_epoch` (
	`yield_generated_eth` real NOT NULL,
	`external_revenue_eth` real NOT NULL,
	`purge_total_spent_eth` real NOT NULL,
	`rollover_eth` real,
	`block_number` integer PRIMARY KEY NOT NULL,
	`block_timestamp` integer NOT NULL,
	`created_by` text,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`address`) ON UPDATE no action ON DELETE no action
);
