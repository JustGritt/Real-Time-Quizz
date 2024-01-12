PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			);
INSERT INTO __drizzle_migrations VALUES(NULL,'1082aedf46928d518346678e43dcbff0009deb9dc7112c73c695ab9519f568ac',1704980395384);
INSERT INTO __drizzle_migrations VALUES(NULL,'8c4c6a0ca49db3a9e4c1898d05bbe645b767920f35be0aa0457ba898ed420a03',1705005342128);
INSERT INTO __drizzle_migrations VALUES(NULL,'8c4c6a0ca49db3a9e4c1898d05bbe645b767920f35be0aa0457ba898ed420a03',1705006073876);
INSERT INTO __drizzle_migrations VALUES(NULL,'8c4c6a0ca49db3a9e4c1898d05bbe645b767920f35be0aa0457ba898ed420a03',1705006515490);
INSERT INTO __drizzle_migrations VALUES(NULL,'ae849f392cb9a6945582e7bdd4c706c0ceafb5369c88006d2330dd5eea42c538',1705006994267);
INSERT INTO __drizzle_migrations VALUES(NULL,'a1c13eeb5bddeee510a88fc80775e0684c69aa720ecbd7263dd35bc167be8cb9',1705007275666);
INSERT INTO __drizzle_migrations VALUES(NULL,'15d1817b8e37a748a883e4796a6ebc58ebd14e00a641f6510de966685e2b2eed',1705008027146);
CREATE TABLE IF NOT EXISTS `users` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int))
);
INSERT INTO users VALUES(1,'charles258@hotmail.fr','popokola','$2b$08$QfPQ2PTk6WR961by3SH9W.0tDDezAKnMd2fgKgVl.clyMLnbpZDmy',1704981393602,1704981393);
INSERT INTO users VALUES(2,'charles2587@hotmail.fr','popokola','$2b$08$14rTjQmqkzDE6KFeaVuHi.Wnqn4XwlX.i3rQD/kN9xZH6JefiGMpy',1704981461,1704981461);
INSERT INTO users VALUES(3,'charles25@hotmail.fr','popokola','$2b$08$edJtgkoiP8il6fSUoGwOH.EVOKz0jrcU458qFmOwwWvsXcMYApGfm',1704981529,1704981529);
INSERT INTO users VALUES(4,'charles@hotmail.fr','popokola','$2b$08$KiCNKwfTf1oVEdvvEWfZg.TgYz3I2XB.bqtaQ/UcgFj0Ro0kCy0wO',1704981543,1704981543);
INSERT INTO users VALUES(5,'charles1@hotmail.fr','popokola','$2b$08$p8Ysejqw.FUtttQJ.bu.buj2f0tzy2p173v2ad8ID7vf/QYd6gQny',1704981566,1704981566);
INSERT INTO users VALUES(6,'charles11@hotmail.fr','popokola','$2b$08$9XHVf4CpXgZuITpOizVwpuGasfGqpNNzyzVa9cnYG1pC2ULpP3rBG',1704981623,1704981623);
CREATE TABLE IF NOT EXISTS `quizzes` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`author_id` integer NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	FOREIGN KEY (`author_id`) REFERENCES `users`(`int`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE IF NOT EXISTS `answers` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`answer` text NOT NULL,
	`timer` integer NOT NULL,
	`is_correct` integer NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`int`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE IF NOT EXISTS `questions` (
	`int` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer NOT NULL,
	`question` text NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`int`) ON UPDATE no action ON DELETE no action
);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',6);
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);
CREATE UNIQUE INDEX `name_idx` ON `quizzes` (`name`);
CREATE INDEX `question_id_idx` ON `answers` (`question_id`);
CREATE INDEX `quiz_id_idx` ON `questions` (`quiz_id`);
COMMIT;
