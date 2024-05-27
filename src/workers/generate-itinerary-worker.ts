import { logger } from "@utils/logger";
import { Worker } from "bullmq";
import { QUEUE_NAME, TASK } from "@utils/constants";
import { createRedisClient } from "@utils/create-redis-client";
import { AiAgent } from "@utils/google-gemini-agent";

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

      const travelAgent = new AiAgent({
        model: "gemini-1.5-pro",
        role: "You are an expert travel agent",
        outputJson: {
          itinerary: {
            startDate: itinerary.start_date,
            endDate: itinerary.end_date,
            scheduleItems: [
              {
                date: itinerary.start_date,
                name: "name of activity",
                description: "description of activity",
                startTime: "start time of activity",
                endTime: "end time of activity",
                duration: "length of activity in minutes",
                price: "estimate cost of activity in USD",
                location: {
                  lat: "latitude of activity",
                  lon: "longitude of activity",
                  address: {
                    street1: "street number and name of location",
                    street2:
                      "optional street name like apartment, unit, or suite",
                    city: "city of location",
                    country: "country of location",
                    postalCode: "postal code of location",
                  },
                },
              },
            ],
          },
        },
      });

      const { destination, length_of_stay } = itinerary;

      const data = await travelAgent.runTaskAsync(
        `Generate a ${length_of_stay}-day itinerary to ${destination}`
      );

      console.log(data.response.text());

      return data.response.text();
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
