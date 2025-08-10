import { db } from "$lib/db/db.js";
import { booksTable, publishersTable, authorsTable, authorsBooksTable } from "$lib/db/schema.js";
import { eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";
import { findOrCreateAuthor } from "$lib/api/api.js";

export async function PUT({ params, request }) {
  try {
    const data = await request.json();

    let publisherId = null;
    if (data.publisherName) {
      const existingPublisher = await db.query.publishersTable.findFirst({
        where: (publisher, {eq}) => eq(publisher.name, data.publisherName),
      });
      if (existingPublisher) {
        publisherId = existingPublisher.id;
      } else {
        const [nextPublisher] = await db.insert(publishersTable).values({
          name: data.publisherName,
        }).returning();
        publisherId = nextPublisher.id;
      }
    }
    await db
      .update(booksTable)
      .set({
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        publisherId,
        subtitle: data.subtitle,
        title: data.title,
      })
      .where(eq(booksTable.id, params.id));

    // Handle author updates if provided
    if (data.authorNames) {
      // Remove existing author relationships
      await db.delete(authorsBooksTable).where(eq(authorsBooksTable.bookId, params.id));
      
      // Add new author relationships
      const authorNames = data.authorNames.split(",").map(name => name.trim()).filter(name => name);
      for (const authorName of authorNames) {
        try {
          const author = await findOrCreateAuthor({
            authorData: { name: authorName }
          });
          await db.insert(authorsBooksTable).values({
            authorId: author.id,
            bookId: parseInt(params.id)
          });
        } catch (error) {
          console.warn(`Skipping invalid author: ${authorName}`, error);
        }
      }
    }

    // Return updated book with relations
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

    return json({ book });
  } catch (error) {
    console.error(error);
    return json({ error: true });
  }
}

export async function DELETE({ params }) {
  try {
    // Delete related records first (foreign key constraints)
    await db.delete(authorsBooksTable).where(eq(authorsBooksTable.bookId, params.id));
    
    // Delete book-tag relationships  
    const { booksTagsTable } = await import("$lib/db/schema.js");
    await db.delete(booksTagsTable).where(eq(booksTagsTable.bookId, params.id));
    
    // Finally delete the book
    await db.delete(booksTable).where(eq(booksTable.id, params.id));
    
    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: true });
  }
}
