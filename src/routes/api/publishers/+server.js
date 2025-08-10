import { json } from "@sveltejs/kit";

import { db } from "$lib/db/db.js";

export const GET = async ({ url }) => {
  const query = url.searchParams.get("query");
  
  if (query && query.length >= 1) {
    const publishers = await db.query.publishersTable.findMany({
      where: (publishers, { like }) => like(publishers.name, `%${query}%`),
      limit: 10,
      orderBy: (publishers, { asc }) => asc(publishers.name),
    });
    return json({ publishers });
  }
  
  return json({ error: true, publishers: [] });
};