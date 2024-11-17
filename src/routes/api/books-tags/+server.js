import { json } from "@sveltejs/kit";

import { findOrCreateTag } from "$lib/api/api.js";
import { db } from "$lib/db/db.js";
import { booksTagsTable } from "$lib/db/schema.js";

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { bookId, tagName } = data;
    const tag = await findOrCreateTag({ tagData: { name: tagName } });
    await db.insert(booksTagsTable).values({
      bookId,
      tagId: tag.id,
    });
    const book = await db.query.booksTable.findFirst({
      where: (books, { eq }) => eq(books.id, bookId),
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
    return json({ book });
  } catch (error) {
    console.error(error);
    return json({ error: true });
  }
};
