CREATE TABLE `answers` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`answer` text NOT NULL,
	`timer` integer NOT NULL,
	`is_correct` integer NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`int`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer NOT NULL,
	`question` text NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`int`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `question_id_idx` ON `answers` (`question_id`);--> statement-breakpoint
CREATE INDEX `quiz_id_idx` ON `questions` (`quiz_id`);