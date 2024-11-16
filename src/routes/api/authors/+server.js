import { json } from "@sveltejs/kit";

import { db } from "$lib/db/db.js";

export const GET = async ({ url }) => {
  const nameQuery = url.searchParams.get("nameQuery");
  if (nameQuery) {
    const authors = await db.query.authorsTable.findMany({
      where: (authors, { like }) => like(authors.name, `%${nameQuery}%`),
      with: {
        books: {
          with: {
            book: {
              with: {
                authors: {
                  with: {
                    author: true,
                  },
                },
                publisher: true,
              },
            },
          },
        },
      },
    });
    return json({ authors });
  }
  return json({ error: true });
};
