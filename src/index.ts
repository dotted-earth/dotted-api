import "@utils/supabase";
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
import { createSupabaseClient } from "@utils/supabase";

// supabase real-time subscriptions
import { supabaseNewItinerarySubscription } from "@subscriptions/itineraries";

export const dottedOllama = await createDottedOllama();
export const redisClient = createRedisClient();
export const supabaseClient = createSupabaseClient();

// create queues
export const generateItineraryQueue = new Queue<GenerateItineraryJobData>(
  QUEUE_NAME.itinerary,
  {
    connection: redisClient,
  }
);

const _generateItineraryWorker = generateItineraryWorker(dottedOllama);

new Elysia().use(waitListServices(supabaseClient)).listen(Bun.env.PORT, () => {
  logger.info(`app starting on PORT: ${Bun.env.PORT}`);

  supabaseNewItinerarySubscription(supabaseClient, generateItineraryQueue);
});

const gracefulShutdown = async (signal: "SIGINT" | "SIGTERM") => {
  logger.info(`Received ${signal}, closing server...`);
  await _generateItineraryWorker.close();

  // Other asynchronous closings
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
