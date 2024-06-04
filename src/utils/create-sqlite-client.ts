import { Database } from "bun:sqlite";
import { logger } from "./logger";
import { drizzle } from "drizzle-orm/bun-sqlite";

export function createSQLiteClient() {
  logger.info("Connecting to local SQLite DB: dotted-api.sqlite");
  const db = new Database("src/db/dotted-api.sqlite");

  const dottedDb = drizzle(db);

  logger.info("Connected to local SQLite DB: dotted-api.sqlite");

  return dottedDb;
}
