import "dotenv/config";
import axios from "axios";
import logger from "../logger.js";
import { GOOGLE_BOOKS_TIMEOUT_MS } from "../config.js";

export default class Opener {
  #baseUrl = "https://www.googleapis.com/books/v1/volumes";

  constructor() {}

  cleanIsbn(dirtyIsbn) {
    return dirtyIsbn.replace(/[-\s]/g, "");
  }

  async fetch(isbn) {
    try {
      logger.info({ isbn }, "Fetching book from Google Books API");
      const cleanIsbn = this.cleanIsbn(isbn);
      const bookKey = `isbn:${cleanIsbn}`;
      const response = await axios.get(this.#baseUrl, {
        params: {
          q: bookKey,
          key: process.env.GOOGLE_API_KEY,
        },
        timeout: GOOGLE_BOOKS_TIMEOUT_MS,
      });
      logger.info({ isbn }, "Successfully fetched book from Google Books API");
      return response.data;
    } catch (error) {
      logger.error(
        { isbn, error: error.message, stack: error.stack },
        "Error fetching book from Google Books API"
      );
      return null;
    }
  }
}
