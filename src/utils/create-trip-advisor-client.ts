import { TripAdvisorProvider } from "src/providers/trip-advisor-provider";
import { logger } from "./logger";

export function createTripAdvisorClient({ apiKey }: { apiKey: string }) {
  const client = new TripAdvisorProvider({ apiKey });
  logger.info("TripAdvisorClient created");
  return client;
}
