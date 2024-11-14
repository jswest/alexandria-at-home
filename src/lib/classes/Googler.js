import "dotenv/config";
import axios from "axios";
import { writeFileSync } from "fs";

export default class Opener {
  #baseUrl = "https://www.googleapis.com/books/v1/volumes";

  constructor() {}

  cleanIsbn(dirtyIsbn) {
    return dirtyIsbn.replace(/[-\s]/g, "");
  }

  async fetch(isbn) {
    const cleanIsbn = this.cleanIsbn(isbn);
    const bookKey = `isbn:${cleanIsbn}`;
    const response = await axios.get(this.#baseUrl, {
      params: {
        q: bookKey,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    return response.data;
  }
}
