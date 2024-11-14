import { json } from "@sveltejs/kit";

import { createBookFromIsbnAndRaw } from "$lib/api/api.js";
import Googler from "$lib/classes/Googler.js";
import { db } from "$lib/db/db.js";

export const POST = async ({ request }) => {
  const data = await request.json();
  const { isbn } = data;
  const googler = new Googler();
  const raw = await googler.fetch(isbn);
  const rawBook = await createBookFromIsbnAndRaw({ isbn, raw });
  if (rawBook) {
    const { id } = rawBook;
    const book = await db.query.booksTable.findFirst({
      where: { id },
      with: {
        authors: {
          with: {
            author: true,
          },
        },
        publisher: true,
      },
    });
    return json({ book });
  } else {
    return null;
  }

};
