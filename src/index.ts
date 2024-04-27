import "@utils/create-supabase-client";
import Elysia from "elysia";
import { logger } from "@utils/logger";
import { Queue } from "bullmq";
import { QUEUE_NAME } from "@utils/constants";
import { generateItineraryWorker } from "./workers/generate-itinerary-worker";

import type { GenerateItineraryJobData } from "./types/generate-itinerary-job-data";

// internal services
import { waitListServices } from "./services/wait-list";

// external services
import { createRedisClient } from "@utils/create-redis-client";
import { createDottedOllama } from "@utils/create-dotted-ollama";
import { createSupabaseClient } from "@utils/create-supabase-client";

// supabase real-time subscriptions
import { supabaseNewItinerarySubscription } from "@subscriptions/itineraries";

export const dottedOllama = await createDottedOllama();
logger.info(`Connected to Ollama on ${Bun.env.OLLAMA_HOST}:11434`);
export const redisClient = createRedisClient();
logger.info(`Connected to Redis on ${Bun.env.REDIS_HOST}:6379`);
export const supabaseClient = createSupabaseClient();
logger.info("Connected to Supabase");

// create queues
export const generateItineraryQueue = new Queue<GenerateItineraryJobData>(
  QUEUE_NAME.itinerary,
  {
    connection: redisClient,
  }
);

const _generateItineraryWorker = generateItineraryWorker(dottedOllama);

new Elysia()
  .use(waitListServices(supabaseClient))
  .listen(Bun.env.PORT, (server) => {
    logger.info(`app starting on ${server.url}`);

    // subscribe to supabase events after external services loaded and server has started
    supabaseNewItinerarySubscription(supabaseClient, generateItineraryQueue);
  });

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
