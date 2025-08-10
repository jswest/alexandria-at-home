import { count, like, and, gte, lte, or } from "drizzle-orm";
import { db } from "$lib/db/db.js";
import { booksTable, authorsTable, publishersTable, authorsBooksTable } from "$lib/db/schema.js";

export async function load({ url }) {
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Get filter parameters
  const titleFilter = url.searchParams.get("title") || "";
  const authorFilter = url.searchParams.get("author") || "";
  const publisherFilter = url.searchParams.get("publisher") || "";
  const yearFrom = url.searchParams.get("yearFrom") || "";
  const yearTo = url.searchParams.get("yearTo") || "";

  // Build where conditions
  const whereConditions = [];
  
  if (titleFilter) {
    whereConditions.push(
      or(
        like(booksTable.title, `%${titleFilter}%`),
        like(booksTable.subtitle, `%${titleFilter}%`)
      )
    );
  }
  
  if (yearFrom) {
    whereConditions.push(gte(booksTable.publishedAt, new Date(`${yearFrom}-01-01`)));
  }
  
  if (yearTo) {
    whereConditions.push(lte(booksTable.publishedAt, new Date(`${yearTo}-12-31`)));
  }

  let whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  // For author and publisher filters, we need to use joins
  let query = db.select().from(booksTable);
  let countQuery = db.select({ count: count() }).from(booksTable);

  if (authorFilter || publisherFilter) {
    if (authorFilter) {
      query = query
        .leftJoin(authorsBooksTable, ({ eq }) => eq(booksTable.id, authorsBooksTable.bookId))
        .leftJoin(authorsTable, ({ eq }) => eq(authorsBooksTable.authorId, authorsTable.id));
      
      countQuery = countQuery
        .leftJoin(authorsBooksTable, ({ eq }) => eq(booksTable.id, authorsBooksTable.bookId))
        .leftJoin(authorsTable, ({ eq }) => eq(authorsBooksTable.authorId, authorsTable.id));
      
      const authorCondition = like(authorsTable.name, `%${authorFilter}%`);
      whereClause = whereClause ? and(whereClause, authorCondition) : authorCondition;
    }
    
    if (publisherFilter) {
      query = query.leftJoin(publishersTable, ({ eq }) => eq(booksTable.publisherId, publishersTable.id));
      countQuery = countQuery.leftJoin(publishersTable, ({ eq }) => eq(booksTable.publisherId, publishersTable.id));
      
      const publisherCondition = like(publishersTable.name, `%${publisherFilter}%`);
      whereClause = whereClause ? and(whereClause, publisherCondition) : publisherCondition;
    }
  }

  if (whereClause) {
    query = query.where(whereClause);
    countQuery = countQuery.where(whereClause);
  }

  // Get total count
  const totalBooksResult = await countQuery.execute();
  const totalBooks = totalBooksResult[0].count;
  const totalPages = Math.ceil(totalBooks / limit);

  let books = [];

  if (totalBooks > 0) {
    if (authorFilter || publisherFilter) {
      // Use complex query with joins when filtering by author/publisher
      const bookResults = await query
        .orderBy(({ desc }) => desc(booksTable.createdAt))
        .limit(limit)
        .offset(offset)
        .execute();

      // Get unique book IDs
      const bookIds = [...new Set(bookResults.map(book => book.id))];

      if (bookIds.length > 0) {
        // Get full book data with relations
        books = await db.query.booksTable.findMany({
          where: (books, { inArray }) => inArray(books.id, bookIds),
          orderBy: (books, { desc }) => [desc(books.createdAt)],
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
          }
        });
      }
    } else {
      // Use simple query when no author/publisher filters
      books = await db.query.booksTable.findMany({
        where: whereClause,
        offset,
        limit,
        orderBy: (books, { desc }) => [desc(books.createdAt)],
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
        }
      });
    }
  }

  return {
    books,
    filters: {
      title: titleFilter,
      author: authorFilter,
      publisher: publisherFilter,
      yearFrom,
      yearTo,
    },
    pagination: {
      currentPage: page,
      totalPages,
      totalBooks,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
