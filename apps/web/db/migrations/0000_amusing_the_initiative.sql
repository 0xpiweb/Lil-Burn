CREATE TABLE `donation` (
	`id` text PRIMARY KEY NOT NULL,
	`tx_hash` text NOT NULL,
	`log_index` integer NOT NULL,
	`donor` text NOT NULL,
	`epoch` integer NOT NULL,
	`amount_wei` text NOT NULL,
	`amount_eth` real NOT NULL,
	`block_number` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `donation_tx_hash_log_index_unique` ON `donation` (`tx_hash`,`log_index`);--> statement-breakpoint
CREATE TABLE `sync_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL
);
