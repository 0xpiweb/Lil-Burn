CREATE INDEX `donation_epoch_idx` ON `donation` (`epoch`);--> statement-breakpoint
CREATE INDEX `donation_epoch_donor_idx` ON `donation` (`epoch`,`donor`);--> statement-breakpoint
CREATE INDEX `donation_donor_amount_idx` ON `donation` (`donor`,`amount_eth`);