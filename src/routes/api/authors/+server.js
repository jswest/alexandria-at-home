import { json } from "@sveltejs/kit";

import { db } from "$lib/db/db.js";

export const GET = async ({ url }) => {
  const nameQuery = url.searchParams.get("nameQuery");
  const query = url.searchParams.get("query");
  
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
  } else if (query && query.length >= 1) {
    // Simple autocomplete endpoint for author names
    const authors = await db.query.authorsTable.findMany({
      where: (authors, { like }) => like(authors.name, `%${query}%`),
      limit: 10,
      orderBy: (authors, { asc }) => asc(authors.name),
    });
    return json({ authors });
  }
  return json({ error: true });
};
