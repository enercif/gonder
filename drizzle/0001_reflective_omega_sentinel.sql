CREATE TABLE `packages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`type` text NOT NULL,
	`rules` text DEFAULT '[]' NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL
);
