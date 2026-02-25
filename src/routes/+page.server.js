import { db } from "$lib/db/db.js";

export async function load() {
  const recentBooks = await db.query.booksTable.findMany({
    limit: 12,
    orderBy: (books, { desc }) => [desc(books.createdAt)],
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

  return { recentBooks };
}
