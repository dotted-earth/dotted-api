import { logger } from "@utils/logger";
import { Worker } from "bullmq";
import { QUEUE_NAME, TASK } from "@utils/constants";
import { createRedisClient } from "@utils/create-redis-client";

import type { GenerateItineraryJobData } from "src/types/generate-itinerary-job-data";
import type { Ollama } from "ollama";
import type { DottedSupabase } from "types";

export function generateItineraryWorker(
  ollama: Ollama,
  supabaseClient: DottedSupabase
) {
  const worker = new Worker<
    GenerateItineraryJobData,
    string,
    typeof TASK.generate_itinerary
  >(
    QUEUE_NAME.itinerary,
    async (job) => {
      const { itinerary } = job.data;
      logger.info(`Job ${job.id} for itinerary ${itinerary.id} processing...`);
      // do something with jobs
      // const prompt = `I am traveling to ${itinerary.destination}. I am staying for ${itinerary.length_of_stay} days and my budget is $${itinerary.budget} USD`;
      const testPrompt =
        "Give me ONE random word as output and display only that output. DO NOT show anything else but the random word. When you have found your random word, EXIT your program";

      const chatResponseStream = await ollama.chat({
        model: "mistral",
        messages: [{ content: testPrompt, role: "user" }],
        stream: true,
      });

      let message: string = "";

      for await (const chatResponse of chatResponseStream) {
        message += chatResponse.message.content;
        job.updateProgress({ message });
      }

      return message;
    },
    {
      connection: createRedisClient({ maxRetriesPerRequest: null }),
    }
  );

  worker.on("completed", async (job, returnValue) => {
    const data = job.data;
    logger.info(`Job ${job.id} complete for itinerary ${data.itinerary.id}`);

    // TODO - get chat response to return json with destinations and activities field
    // parse through info and create data in the db
    returnValue;

    // update the itinerary status to draft mode
    await supabaseClient
      .from("itineraries")
      .update({ itinerary_status: "draft" })
      .eq("id", data.itinerary.id);
  });

  worker.on("progress", async (job, progress) => {
    logger.info(
      `process update ${job.id}: ${
        typeof progress == "object"
          ? "message" in progress
            ? progress.message
            : "no message"
          : progress
      }`
    );
  });

  worker.on("failed", async (job, returnValue) => {
    const data = job?.data;

    if (data) {
      await supabaseClient
        .from("itineraries")
        .update({ itinerary_status: "ai_failure" })
        .eq("id", data.itinerary.id);
    }

    logger.error(`Job ${job?.id} failed`, returnValue);
  });

  return worker;
}
