import "@utils/create-supabase-client";
import Elysia from "elysia";
import { logger } from "@utils/logger";
import { Queue } from "bullmq";
import { QUEUE_NAME } from "@utils/constants";
import { generateItineraryWorker } from "./workers/generate-itinerary-worker";

// internal services
import { waitListServices } from "./services/wait-list";

// external services
import { createRedisClient } from "@utils/create-redis-client";
import { createSupabaseClient } from "@utils/create-supabase-client";
// import { createSQLiteClient } from "@utils/create-sqlite-client";
// import { createViatorClient } from "@utils/create-viator-client";
// import { createTripAdvisorClient } from "@utils/create-trip-advisor-client";

// supabase real-time subscriptions
import {
  supabaseNewItinerarySubscription,
  supabaseRegenerateItinerarySubscription,
} from "@subscriptions/itineraries";

import type { GenerateItineraryJobData } from "./types/generate-itinerary-job-data";

export const redisClient = createRedisClient();
export const supabaseClient = createSupabaseClient();
// export const viatorClient = createViatorClient({
//   apiKey: Bun.env.VIATOR_API_KEY,
// });
// export const dottedDb = createSQLiteClient();
// export const tripAdvisorClient = createTripAdvisorClient({
//   apiKey: Bun.env.TRIP_ADVISOR_CONTENT_API_KEY,
// });

// create queues
export const generateItineraryQueue = new Queue<GenerateItineraryJobData>(
  QUEUE_NAME.itinerary,
  {
    connection: redisClient,
  }
);

const _generateItineraryWorker = generateItineraryWorker(supabaseClient);

const gracefulShutdown = async (signal: "SIGINT" | "SIGTERM") => {
  logger.info(`Received ${signal}, closing server...`);
  await _generateItineraryWorker.close();

  // Other asynchronous closings
  process.exit(0);
};

const processSignals = ["SIGINT", "SIGTERM"] as const;
processSignals.forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});

const app = new Elysia()
  .use(waitListServices(supabaseClient))
  .listen(Bun.env.PORT, () => {
    // subscribe to supabase events after external services loaded and server has started
    supabaseNewItinerarySubscription(supabaseClient, generateItineraryQueue);
    supabaseRegenerateItinerarySubscription(
      supabaseClient,
      generateItineraryQueue
    );
  });

logger.info(`app starting on ${app.server?.url}`);
