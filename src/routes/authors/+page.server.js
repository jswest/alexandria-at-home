import { count, like, and, gte, lte } from "drizzle-orm";
import { db } from "$lib/db/db.js";
import { authorsTable } from "$lib/db/schema.js";

export const load = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Get filter parameters
  const nameFilter = url.searchParams.get("name") || "";
  const birthYearFrom = url.searchParams.get("birthYearFrom") || "";
  const birthYearTo = url.searchParams.get("birthYearTo") || "";

  // Build where conditions
  const whereConditions = [];
  
  if (nameFilter) {
    whereConditions.push(like(authorsTable.name, `%${nameFilter}%`));
  }
  
  if (birthYearFrom) {
    whereConditions.push(gte(authorsTable.bornAt, new Date(`${birthYearFrom}-01-01`)));
  }
  
  if (birthYearTo) {
    whereConditions.push(lte(authorsTable.bornAt, new Date(`${birthYearTo}-12-31`)));
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  // Get total count of authors with filters
  const totalAuthorsResult = await db
    .select({ count: count() })
    .from(authorsTable)
    .where(whereClause);
  const totalAuthors = totalAuthorsResult[0].count;
  const totalPages = Math.ceil(totalAuthors / limit);

  // Get paginated authors with their book counts
  const authors = await db.query.authorsTable.findMany({
    where: whereClause,
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
    filters: {
      name: nameFilter,
      birthYearFrom,
      birthYearTo,
    },
    pagination: {
      currentPage: page,
      totalPages,
      totalAuthors,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};