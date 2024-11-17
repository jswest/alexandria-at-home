import { db } from "$lib/db/db.js";

export async function load({ params }) {
  const publisher = await db.query.publishersTable.findFirst({
    where: (publishers, { eq }) => eq(publishers.id, params.id),
    with: {
      books: {
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
          }
        },
      },
    },
  });
  return { publisher };
}
