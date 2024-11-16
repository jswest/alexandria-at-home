import { db } from "$lib/db/db.js";
import { authorsTable } from "$lib/db/schema.js";
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
    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ error: true });
  }
}
