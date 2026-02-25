export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getYear(date) {
  if (!date) return null;
  if (date instanceof Date) return date.getFullYear();
  return new Date(date).getFullYear();
}

export function hydrateBookDates(book) {
  if (book.publishedAt && !(book.publishedAt instanceof Date)) {
    book.publishedAt = new Date(book.publishedAt);
  }
  for (const a of book.authors || []) {
    if (a.author?.bornAt && !(a.author.bornAt instanceof Date)) {
      a.author.bornAt = new Date(a.author.bornAt);
    }
  }
  return book;
}
