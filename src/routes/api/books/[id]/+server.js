import { db } from "$lib/db/db.js";
import { booksTable, publishersTable } from "$lib/db/schema.js";
import { eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

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
    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: true });
  }
}
