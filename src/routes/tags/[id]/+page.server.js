import { db } from "$lib/db/db.js";

export async function load({ params }) {
  const tag = await db.query.tagsTable.findFirst({
    where: (tags, { eq }) => eq(tags.id, params.id),
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
              tags: {
                with: {
                  tag: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return { tag };
}
