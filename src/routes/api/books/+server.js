import { eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

import {
  createBookFromIsbnAndRaw,
  findOrCreateAuthor,
  findOrCreateBook,
  findOrCreatePublisher,
} from "$lib/api/api.js";
import Googler from "$lib/classes/Googler.js";
import WikiDater from "$lib/classes/WikiDater.js";
import { db } from "$lib/db/db.js";
import { authorsTable } from "$lib/db/schema.js";
import { sleep } from "$lib/util.js";
import logger from "$lib/logger.js";
import { WIKIDATA_FETCH_DELAY_MS } from "$lib/config.js";

export const GET = async ({ url }) => {
  const titleQuery = url.searchParams.get("titleQuery");
  if (titleQuery) {
    const books = await db.query.booksTable.findMany({
      where: (books, { like, or }) =>
        or(
          like(books.subtitle, `%${titleQuery}%`),
          like(books.title, `%${titleQuery}%`)
        ),
      with: {
        authors: {
          with: {
            author: true,
          },
        },
        publisher: true,
      },
    });
    return json({ books });
  }
  return json({ error: true });
};

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { authorNames, isbn, publishedAt, publisherName, subtitle, title } =
      data;
    let rawBook;
    if (title) {
      const authors = [];
      for (const authorName of authorNames.split(",")) {
        const trimmedName = authorName.trim();
        if (trimmedName) {
          try {
            const author = await findOrCreateAuthor({
              authorData: { name: trimmedName },
            });
            authors.push(author);
          } catch (error) {
            logger.warn({ authorName: trimmedName, error: error.message }, "Skipping invalid author");
          }
        }
      }
      const publisher = await findOrCreatePublisher({
        publisherData: { name: publisherName },
      });
      const book = await findOrCreateBook({
        authorIds:
          authors.length > 0 ? authors.map((author) => author.id) : null,
        bookData: {
          isbn,
          publishedAt: new Date(`${publishedAt}-01-01`),
          subtitle,
          title,
        },
        publisherId: publisher?.id,
      });
      rawBook = book;
    } else {
      const googler = new Googler();
      const raw = await googler.fetch(isbn);
      rawBook = await createBookFromIsbnAndRaw({ isbn, raw });

      // Handle ISBN-not-found error from createBookFromIsbnAndRaw
      if (rawBook && rawBook.error) {
        return json(rawBook);
      }
    }
    if (rawBook) {
      const { id } = rawBook;
      let book = await db.query.booksTable.findFirst({
        where: (books, { eq }) => eq(books.id, id),
        with: {
          authors: {
            with: {
              author: true,
            },
          },
          publisher: true,
        },
      });
      const wikiDater = new WikiDater();
      for (const a of book.authors) {
        const author = a?.author;
        if (author && !author.bornAt) {
          await sleep(WIKIDATA_FETCH_DELAY_MS);
          const birthday = await wikiDater.fetch(author.name);
          if (birthday) {
            await db
              .update(authorsTable)
              .set({ bornAt: birthday })
              .where(eq(authorsTable.id, author.id));
          }
        }
      }
      return json({ book });
    } else {
      return json({ error: true });
    }
  } catch (error) {
    logger.error({ error: error.message, stack: error.stack }, "Error in POST /api/books");
    return json({ error: error.message });
  }
};
