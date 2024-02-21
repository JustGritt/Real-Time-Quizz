ALTER TABLE users ADD `socket_id` text;--> statement-breakpoint
ALTER TABLE `connected_users` DROP COLUMN `socket_id`;