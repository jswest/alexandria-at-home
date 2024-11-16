import { db } from "$lib/db/db.js";

export async function load({ params }) {
  const author = await db.query.authorsTable.findFirst({
    where: (authors, { eq }) => eq(authors.id, params.id),
    with: {
      books: {
        with: {
          book: {
            with: {
              publisher: true,
              authors: {
                with: {
                  author: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return { author };
}
