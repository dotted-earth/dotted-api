import { logger } from "@utils/logger";
import { Worker } from "bullmq";
import { QUEUE_NAME, TASK } from "@utils/constants";
import { createRedisClient } from "@utils/create-redis-client";

import type { GenerateItineraryJobData } from "src/types/generate-itinerary-job-data";
import type { DottedSupabase } from "types";

export function generateItineraryWorker(supabaseClient: DottedSupabase) {
  const worker = new Worker<
    GenerateItineraryJobData,
    string,
    typeof TASK.generate_itinerary
  >(
    QUEUE_NAME.itinerary,
    async (job) => {
      const { itinerary, cuisines, diets, foodAllergies, recreations } =
        job.data;
      logger.info(`Job ${job.id} for itinerary ${itinerary.id} processing...`);

      // We'll secure our python server later with Basic Auth
      let token = "";

      const data = await fetch(`${Bun.env.DOTTED_CREW_URL}/generate`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
          itinerary,
          cuisines,
          diets,
          food_allergies: foodAllergies,
          recreations,
        }),
      }).then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      });
      console.log(data);

      let message: string = "";

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
