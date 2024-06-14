import { ViatorProvider } from "src/providers/viator-provider";
import { logger } from "./logger";

export function createViatorClient({ apiKey }: { apiKey: string }) {
  const client = new ViatorProvider({ apiKey });
  logger.info("ViatorProvider created");
  return client;
}
