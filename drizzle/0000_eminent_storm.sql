CREATE TABLE `authors_books` (
	`author_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	PRIMARY KEY(`author_id`, `book_id`),
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `authors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL,
	`born_at` integer,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL,
	`isbn` text,
	`published_at` integer NOT NULL,
	`publisher_id` integer,
	`subtitle` text,
	`thumbnail_url` text,
	`title` text NOT NULL,
	FOREIGN KEY (`publisher_id`) REFERENCES `publishers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `publishers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL
);
