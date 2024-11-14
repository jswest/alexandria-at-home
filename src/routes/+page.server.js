import { db } from "$lib/db/db.js";

export async function load({ params }) {
  const books = await db.query.booksTable.findMany({
    orderBy: (books, { desc }) => [desc(books.createdAt)],
    with: {
      authors: {
        with: {
          author: true,
        },
      },
      publisher: true,
    },
  });
  return { books };
}
