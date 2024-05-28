import { logger } from "@utils/logger";
import { Worker } from "bullmq";
import { QUEUE_NAME, TASK } from "@utils/constants";
import { createRedisClient } from "@utils/create-redis-client";
import { AiAgent } from "@utils/google-gemini-agent";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { itineraryModel } from "src/models/itinerary-model";

import type { GenerateItineraryJobData } from "src/types/generate-itinerary-job-data";
import type { DottedSupabase } from "types";

export function generateItineraryWorker(supabaseClient: DottedSupabase) {
  const worker = new Worker<
    GenerateItineraryJobData,
    Record<string, any>,
    typeof TASK.generate_itinerary
  >(
    QUEUE_NAME.itinerary,
    async (job) => {
      const { itinerary, cuisines, diets, foodAllergies, recreations } =
        job.data;
      logger.info(`Job ${job.id} for itinerary ${itinerary.id} processing...`);

      const travelAgent = new AiAgent({
        model: "gemini-1.5-pro",
        role: "You are an expert travel agent",
        outputJson: itineraryModel.examples,
      });

      const { destination, length_of_stay, start_date, end_date } = itinerary;

      const data = await travelAgent.runTaskAsync(
        `Generate a ${length_of_stay}-day itinerary to ${destination} for the dates ${start_date} to ${end_date}.
         The activities should include: ${recreations
           .map((r) => r.name)
           .join(", ")}.
         Dietary restrictions to include: ${diets.map((d) => d.name).join(", ")}
         Cuisines to include: ${cuisines.map((c) => c.name).join(", ")}
         Consider meal options with fool allergies: ${foodAllergies
           .map((f) => f.name)
           .join(", ")}
        `
      );

      // Set up a parser
      const parser = new JsonOutputParser();
      const itineraryDraft = await parser.parse(data.response.text());

      return itineraryDraft;
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
    console.log(returnValue);

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
