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
import { createViatorClient } from "@utils/create-viator-client";
import { createTursoClient } from "@utils/create-turso-client";

// supabase real-time subscriptions
import { supabaseNewItinerarySubscription } from "@subscriptions/itineraries";

import type { GenerateItineraryJobData } from "./types/generate-itinerary-job-data";
import type { Destination } from "./models/viator-response";

export const redisClient = createRedisClient();
export const supabaseClient = createSupabaseClient();
export const tursoClient = createTursoClient();
export const viatorClient = createViatorClient({
  apiKey: Bun.env.VIATOR_API_KEY,
});

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
  .listen(Bun.env.PORT, async () => {
    // const destinations = await viatorClient.getDestinations();
    // const destinationText = await Bun.file("src/data/destinations.json", {
    //   type: "application/json",
    // }).text();
    // const destinations: Destination[] = JSON.parse(destinationText);

    // for (const destination of destinations) {

    // }

    // subscribe to supabase events after external services loaded and server has started
    supabaseNewItinerarySubscription(supabaseClient, generateItineraryQueue);
  });

logger.info(`app starting on ${app.server?.url}`);
