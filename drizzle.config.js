export default {
  schema: "./src/lib/db/schema.js",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: './dev.db',
  }
}