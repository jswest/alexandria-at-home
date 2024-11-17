import { db } from "$lib/db/db.js";

export async function load({ params }) {
  const book = await db.query.booksTable.findFirst({
    where: (books, { eq }) => eq(books.id, params.id),
    with: {
      authors: {
        with: {
          author: true,
        },
      },
      publisher: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
  });
  return { book };
}
