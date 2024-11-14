import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const publishersTable = sqliteTable("publishers", {
  id: integer().primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  name: text().notNull().unique(),
});

export const booksTable = sqliteTable("books", {
  id: integer().primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  description: text(),
  isbn: text().notNull().unique(),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  publisherId: integer("publisher_id").references(() => publishersTable.id),
  subtitle: text(),
  thumbnailUrl: text("thumbnail_url"),
  title: text().notNull(),
});

export const authorsTable = sqliteTable("authors", {
  id: integer().primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  bornAt: integer("born_at", { mode: "timestamp" }),
  name: text().notNull().unique(),
});

export const authorsBooksTable = sqliteTable(
  "authors_books",
  {
    authorId: integer("author_id")
      .notNull()
      .references(() => authorsTable.id),
    bookId: integer("book_id")
      .notNull()
      .references(() => booksTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.authorId, table.bookId] }),
  })
);

export const publishersRelations = relations(publishersTable, ({ many }) => ({
  books: many(booksTable),
}));

export const booksRelations = relations(booksTable, ({ one, many }) => ({
  publisher: one(publishersTable, {
    fields: [booksTable.publisherId],
    references: [publishersTable.id],
  }),
  authors: many(authorsBooksTable),
}));

export const authorsRelations = relations(authorsTable, ({ many }) => ({
  books: many(authorsBooksTable),
}));

export const authorsBooksRelations = relations(
  authorsBooksTable,
  ({ one }) => ({
    author: one(authorsTable, {
      fields: [authorsBooksTable.authorId],
      references: [authorsTable.id],
    }),
    book: one(booksTable, {
      fields: [authorsBooksTable.bookId],
      references: [booksTable.id],
    }),
  })
);