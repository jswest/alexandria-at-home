PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL,
	`isbn` text NOT NULL,
	`published_at` integer NOT NULL,
	`publisher_id` integer,
	`subtitle` text,
	`thumbnail_url` text,
	`title` text NOT NULL,
	FOREIGN KEY (`publisher_id`) REFERENCES `publishers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_books`("id", "created_at", "isbn", "published_at", "publisher_id", "subtitle", "thumbnail_url", "title") SELECT "id", "created_at", "isbn", "published_at", "publisher_id", "subtitle", "thumbnail_url", "title" FROM `books`;--> statement-breakpoint
DROP TABLE `books`;--> statement-breakpoint
ALTER TABLE `__new_books` RENAME TO `books`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `books_isbn_unique` ON `books` (`isbn`);--> statement-breakpoint
CREATE UNIQUE INDEX `authors_name_unique` ON `authors` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `publishers_name_unique` ON `publishers` (`name`);