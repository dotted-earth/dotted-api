import { createClient } from "@libsql/client";
import { logger } from "./logger";

export function createTursoClient() {
  const client = createClient({
    url: Bun.env.TURSO_DATABASE_URL,
    authToken: Bun.env.TURSO_AUTH_TOKEN,
  });
  logger.info(`Connected to Turso DB: ${Bun.env.TURSO_DATABASE_URL}`);
  return client;
}
