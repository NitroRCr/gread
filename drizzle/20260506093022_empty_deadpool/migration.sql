CREATE TABLE `repos` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`full_name` text NOT NULL UNIQUE,
	`description` text,
	`stars` integer DEFAULT 0 NOT NULL,
	`language` text,
	`doc_repo_name` text,
	`last_indexed_at` integer
);
