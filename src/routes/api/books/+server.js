import { eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

import { createBookFromIsbnAndRaw } from "$lib/api/api.js";
import Googler from "$lib/classes/Googler.js";
import WikiDater from "$lib/classes/WikiDater.js";
import { db } from "$lib/db/db.js";
import { authorsTable } from "$lib/db/schema.js";
import { sleep } from "$lib/util.js";

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
    const { isbn } = data;
    const googler = new Googler();
    const raw = await googler.fetch(isbn);
    const rawBook = await createBookFromIsbnAndRaw({ isbn, raw });
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
          await sleep(1000);
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
    console.error(error);
    return json({ error: error.message });
  }
};
