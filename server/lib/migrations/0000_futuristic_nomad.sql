CREATE TABLE `users` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);