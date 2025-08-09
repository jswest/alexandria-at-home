import { count } from "drizzle-orm";
import { db } from "$lib/db/db.js";
import { authorsTable } from "$lib/db/schema.js";

export const load = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 100;
  const offset = (page - 1) * limit;

  // Get total count of authors
  const totalAuthorsResult = await db.select({ count: count() }).from(authorsTable);
  const totalAuthors = totalAuthorsResult[0].count;
  const totalPages = Math.ceil(totalAuthors / limit);

  // Get paginated authors with their book counts
  const authors = await db.query.authorsTable.findMany({
    offset,
    limit,
    orderBy: (authors, { asc }) => asc(authors.name),
    with: {
      books: {
        with: {
          book: true,
        },
      },
    },
  });

  return {
    authors,
    pagination: {
      currentPage: page,
      totalPages,
      totalAuthors,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};