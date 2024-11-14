import { db } from "./../db/db.js";
import {
  authorsBooksTable,
  authorsTable,
  booksTable,
  publishersTable,
} from "./..//db/schema.js";

export async function createBookFromIsbnAndRaw({ isbn, raw }) {
  if (!raw) {
    return false;
  }

  const item = raw?.items?.[0]?.volumeInfo;
  if (!item) {
    return false;
  }

  const authors = [];
  for (const name of item.authors) {
    const author = await findOrCreateAuthor({
      authorData: { name },
    });
    authors.push(author);
  }

  let publisher;
  if (item.publisher) {
    publisher = await findOrCreatePublisher({
      publisherData: { name: item.publisher },
    });
  }

  const book = await findOrCreateBook({
    authorIds: authors.map((author) => author.id),
    bookData: {
      description: item.description,
      isbn,
      publishedAt: new Date(item.publishedDate),
      subtitle: item.subtitle,
      thumbnailUrl: item.imageLinks?.thumbnail,
      title: item.title,
    },
    publisherId: publisher?.id,
  });
}

export async function findOrCreateAuthor({ authorData }) {
  const [author] = await db
    .insert(authorsTable)
    .values(authorData)
    .returning()
    .onConflictDoUpdate({
      target: authorsTable.name,
      set: { name: authorData.name },
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
