import { db } from "./../db/db.js";
import {
  authorsBooksTable,
  authorsTable,
  booksTable,
  publishersTable,
  tagsTable,
} from "./..//db/schema.js";

export async function createBookFromIsbnAndRaw({ isbn, raw }) {
  try {
    console.log('createBookFromIsbnAndRaw called with:', { isbn, hasRaw: !!raw });
    
    if (!raw) {
      console.log('No raw data provided');
      return false;
    }

    console.log('Raw data structure:', JSON.stringify(raw, null, 2));

    // Check if Google Books API found any results
    if (raw.totalItems === 0) {
      console.log('Google Books API found no results for ISBN:', isbn);
      
      // Create a basic book entry with just the ISBN
      const book = await findOrCreateBook({
        authorIds: [],
        bookData: {
          isbn,
          title: `Book ${isbn}`,
          description: 'Book details not found in Google Books API. Please edit to add correct information.',
          publishedAt: null,
          subtitle: null,
          thumbnailUrl: null,
        },
        publisherId: null,
      });
      
      console.log('Created placeholder book:', book.id);
      return book;
    }

    const item = raw?.items?.[0]?.volumeInfo;
    if (!item) {
      console.log('No volumeInfo found in raw data');
      console.log('Available keys in raw:', Object.keys(raw));
      if (raw.items) {
        console.log('Items length:', raw.items.length);
        if (raw.items[0]) {
          console.log('First item keys:', Object.keys(raw.items[0]));
        }
      }
      return false;
    }

    console.log('Processing book:', item.title, 'by', item.authors);

    const authors = [];
    if (item.authors && Array.isArray(item.authors)) {
      for (const name of item.authors) {
        try {
          const author = await findOrCreateAuthor({
            authorData: { name },
          });
          authors.push(author);
        } catch (error) {
          console.error('Error creating author:', name, error);
        }
      }
    } else {
      console.log('No authors found for book');
    }

    let publisher;
    if (item.publisher) {
      try {
        publisher = await findOrCreatePublisher({
          publisherData: { name: item.publisher },
        });
      } catch (error) {
        console.error('Error creating publisher:', item.publisher, error);
      }
    }

    console.log('Creating book with data:', {
      title: item.title,
      authors: authors.length,
      publisher: publisher?.name
    });

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

    console.log('Book created successfully:', book.id);
    return book;
  } catch (error) {
    console.error('Error in createBookFromIsbnAndRaw:', error);
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
