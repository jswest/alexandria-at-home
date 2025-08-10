import { and, eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

import { findOrCreateTag } from "$lib/api/api.js";
import { db } from "$lib/db/db.js";
import { booksTagsTable, tagsTable } from "$lib/db/schema.js";

export const GET = async ({ url }) => {
  try {
    const query = url.searchParams.get("query");
    if (query && query.length >= 1) {
      const tags = await db.query.tagsTable.findMany({
        where: (tags, { like }) => like(tags.name, `%${query}%`),
        limit: 10,
        orderBy: (tags, { asc }) => asc(tags.name),
      });
      return json({ tags });
    }
    return json({ tags: [] });
  } catch (error) {
    console.error(error);
    return json({ error: true, tags: [] });
  }
};

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

export const DELETE = async ({ request }) => {
  try {
    const data = await request.json();
    const { bookId, tagId } = data;
    
    await db
      .delete(booksTagsTable)
      .where(
        and(
          eq(booksTagsTable.bookId, bookId),
          eq(booksTagsTable.tagId, tagId)
        )
      );

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
