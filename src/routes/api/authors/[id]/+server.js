import { db } from "$lib/db/db.js";
import { authorsTable, authorsBooksTable } from "$lib/db/schema.js";
import { eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

export async function PUT({ params, request }) {
  try {
    const data = await request.json();
    await db
      .update(authorsTable)
      .set({
        name: data.name,
        bornAt: data.bornAt ? new Date(data.bornAt) : null,
      })
      .where(eq(authorsTable.id, params.id));

    // Return updated author with book count
    const author = await db.query.authorsTable.findFirst({
      where: (authors, { eq }) => eq(authors.id, params.id),
      with: {
        books: {
          with: {
            book: true,
          },
        },
      },
    });

    return json({ author });
  } catch (error) {
    console.error(error);
    return json({ error: true });
  }
}

export async function DELETE({ params }) {
  try {
    // Delete author-book relationships first (foreign key constraints)
    await db.delete(authorsBooksTable).where(eq(authorsBooksTable.authorId, params.id));
    
    // Finally delete the author
    await db.delete(authorsTable).where(eq(authorsTable.id, params.id));
    
    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: true });
  }
}
