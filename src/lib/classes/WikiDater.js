import axios from "axios";
import pino from "pino";

export default class WikiDater {
  #baseUrl = "https://query.wikidata.org/sparql";
  #logger = pino({
    name: "WikiDater",
    level: process.env.LOG_LEVEL || "info",
  });

  constructor() {}

  async fetch(authorName) {
    try {
      this.#logger.info(
        "Fetching birthday from WikiData API for author",
        authorName
      );
      const query = `
      SELECT ?birthday WHERE {
        ?author wdt:P31 wd:Q5;
          rdfs:label "${authorName}"@en;
          wdt:P569 ?birthday.
        }
      LIMIT 1
    `;
      const response = await axios.get(this.#baseUrl, {
        params: {
          query,
          format: "json",
        },
        headers: {
          Accept: "application/json",
          "User-Agent": "WikiDater/1.0",
        },
      });

      this.#logger.info(
        "Successfully fetched birthday from WikiData API for author",
        authorName
      );
      return (
        new Date(response.data.results.bindings[0]?.birthday?.value) || null
      );
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);
      this.#logger.error(
        `Error fetching birthday from WikiData API for author ${authorName}`,
        error.message,
        error.stack
      );
      return null;
    }
  }
}
