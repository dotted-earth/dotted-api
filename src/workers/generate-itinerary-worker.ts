import { logger } from "@utils/logger";
import { Worker } from "bullmq";
import { QUEUE_NAME } from "@utils/constants";

import type { GenerateItineraryJobData } from "src/types/generate-itinerary-job-data";
import type { Ollama } from "ollama";
import { createRedisClient } from "@utils/create-redis-client";

export function generateItineraryWorker(ollama: Ollama) {
  const worker = new Worker<GenerateItineraryJobData>(
    QUEUE_NAME.itinerary,
    async (job) => {
      const { itinerary } = job.data;
      logger.info(`Job ${job.id} for itinerary ${itinerary.id} processing...`);
      // do something with jobs
      // const prompt = `I am traveling to ${itinerary.destination}. I am staying for ${itinerary.length_of_stay} days and my budget is $${itinerary.budget} USD`;
      const testPrompt = "In one sentence, describe yourself";

      try {
        await ollama.chat({
          model: "mistral",
          messages: [{ content: testPrompt, role: "user" }],
          keep_alive: -1,
        });
        logger.info(`Job ${job.id} complete. Itinerary generated`);
      } catch (error) {
        logger.error(`Job ${job.id} failed.`, error);
      }
    },
    {
      connection: createRedisClient({ maxRetriesPerRequest: null }),
    }
  );

  return worker;
}
