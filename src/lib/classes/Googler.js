import "dotenv/config";
import axios from "axios";
import pino from "pino";

export default class Opener {
  #baseUrl = "https://www.googleapis.com/books/v1/volumes";
  #logger = pino({
    name: "Googler",
    level: process.env.LOG_LEVEL || "info",
  });

  constructor() {}

  cleanIsbn(dirtyIsbn) {
    return dirtyIsbn.replace(/[-\s]/g, "");
  }

  async fetch(isbn) {
    try {
      this.#logger.info("Fetching book from Google Books API for ISBN", isbn);
      const cleanIsbn = this.cleanIsbn(isbn);
      const bookKey = `isbn:${cleanIsbn}`;
      const response = await axios.get(this.#baseUrl, {
        params: {
          q: bookKey,
          key: process.env.GOOGLE_API_KEY,
        },
        timeout: 5000,
      });
      this.#logger.info(
        "Successfully fetched book from Google Books API for ISBN",
        isbn
      );
      return response.data;
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);
      this.#logger.error(
        `Error fetching book from Google Books API for ISBN ${isbn}`,
        error.message,
        error.stack
      );
      return null;
    }
  }
}
