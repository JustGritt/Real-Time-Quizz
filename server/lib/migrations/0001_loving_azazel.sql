CREATE TABLE `quizzes` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`author_id` integer NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	FOREIGN KEY (`author_id`) REFERENCES `users`(`int`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `name_idx` ON `quizzes` (`name`);