import axios from "axios";
import logger from "../logger.js";

export default class WikiDater {
  #baseUrl = "https://query.wikidata.org/sparql";

  constructor() {}

  async fetch(authorName) {
    try {
      logger.info({ authorName }, "Fetching birthday from WikiData API");
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

      logger.info({ authorName }, "Successfully fetched birthday from WikiData API");
      return (
        new Date(response.data.results.bindings[0]?.birthday?.value) || null
      );
    } catch (error) {
      logger.error(
        { authorName, error: error.message, stack: error.stack },
        "Error fetching birthday from WikiData API"
      );
      return null;
    }
  }
}
