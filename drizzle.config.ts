import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    authToken: process.env.TURSO_AUTH_TOKEN,
    url: process.env.TURSO_DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
