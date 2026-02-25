import { db } from "../db/db.js";
import {
  authorsBooksTable,
  authorsTable,
  booksTable,
  publishersTable,
  tagsTable,
} from "../db/schema.js";
import logger from "../logger.js";

export async function createBookFromIsbnAndRaw({ isbn, raw }) {
  try {
    logger.info({ isbn, hasRaw: !!raw }, "createBookFromIsbnAndRaw called");

    if (!raw) {
      logger.warn({ isbn }, "No raw data provided");
      return false;
    }

    // Check if Google Books API found any results
    if (raw.totalItems === 0) {
      logger.warn({ isbn }, "Google Books API found no results for ISBN");
      return { error: true, message: `No book found for ISBN ${isbn}. Please add details manually.` };
    }

    const item = raw?.items?.[0]?.volumeInfo;
    if (!item) {
      logger.warn({ isbn, keys: Object.keys(raw) }, "No volumeInfo found in raw data");
      return false;
    }

    logger.info({ title: item.title, authors: item.authors }, "Processing book");

    const authors = [];
    if (item.authors && Array.isArray(item.authors)) {
      for (const name of item.authors) {
        try {
          const author = await findOrCreateAuthor({
            authorData: { name },
          });
          authors.push(author);
        } catch (error) {
          logger.error({ authorName: name, error: error.message }, "Error creating author");
        }
      }
    } else {
      logger.info({ isbn }, "No authors found for book");
    }

    let publisher;
    if (item.publisher) {
      try {
        publisher = await findOrCreatePublisher({
          publisherData: { name: item.publisher },
        });
      } catch (error) {
        logger.error({ publisher: item.publisher, error: error.message }, "Error creating publisher");
      }
    }

    logger.info({ title: item.title, authorCount: authors.length, publisher: publisher?.name }, "Creating book");

    const book = await findOrCreateBook({
      authorIds: authors.length > 0 ? authors.map((author) => author.id) : [],
      bookData: {
        description: item.description,
        isbn,
        publishedAt: item.publishedDate ? new Date(item.publishedDate) : null,
        subtitle: item.subtitle,
        thumbnailUrl: item.imageLinks?.thumbnail,
        title: item.title,
      },
      publisherId: publisher?.id,
    });

    logger.info({ bookId: book.id }, "Book created successfully");
    return book;
  } catch (error) {
    logger.error({ error: error.message, stack: error.stack }, "Error in createBookFromIsbnAndRaw");
    throw error;
  }
}

export async function findOrCreateAuthor({ authorData }) {
  // Validate that author name is not empty
  if (!authorData.name || !authorData.name.trim()) {
    throw new Error('Author name cannot be empty');
  }

  const [author] = await db
    .insert(authorsTable)
    .values({ ...authorData, name: authorData.name.trim() })
    .returning()
    .onConflictDoUpdate({
      target: authorsTable.name,
      set: { name: authorData.name.trim() },
    });
  return author;
}

export async function findOrCreateBook({ authorIds, bookData, publisherId }) {
  const [book] = await db
    .insert(booksTable)
    .values({
      ...bookData,
      publisherId,
    })
    .returning()
    .onConflictDoUpdate({
      target: booksTable.isbn,
      set: { isbn: bookData.isbn },
    });
  for (const authorId of authorIds) {
    await db.insert(authorsBooksTable).values({
      authorId,
      bookId: book.id,
    });
  }
  return book;
}

export async function findOrCreatePublisher({ publisherData }) {
  const [publisher] = await db
    .insert(publishersTable)
    .values(publisherData)
    .returning()
    .onConflictDoUpdate({
      target: publishersTable.name,
      set: { name: publisherData.name },
    });
  return publisher;
}

export async function findOrCreateTag({ tagData }) {
  const [tag] = await db
    .insert(tagsTable)
    .values(tagData)
    .returning()
    .onConflictDoUpdate({
      target: tagsTable.name,
      set: { name: tagData.name },
    });
  return tag;
}
