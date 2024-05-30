import { ViatorClient } from "src/providers/viator-client";
import { logger } from "./logger";

export function createViatorClient({ apiKey }: { apiKey: string }) {
  const client = new ViatorClient({ apiKey });
  logger.info("ViatorClient created");
  return client;
}
