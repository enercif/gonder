CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`package_id` text NOT NULL,
	`type` text NOT NULL,
	`detail` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `activities_package_id_idx` ON `activities` (`package_id`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`package_id` text NOT NULL,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`mime_type` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `files_package_id_idx` ON `files` (`package_id`);