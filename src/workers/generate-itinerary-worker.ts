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

      const {
        destination,
        length_of_stay,
        start_date,
        end_date,
        budget,
        accommodation,
      } = itinerary;

      // need start time, end time, and budget
      const data = await travelAgent.runTaskAsync(
        `Generate a ${length_of_stay}-day itinerary to ${destination} for the dates ${start_date} to ${end_date} starting and ending at ${accommodation}.

        The budget for the whole trip is $${budget}.

        ${
          recreations.length
            ? `The activities should include: ${recreations
                .map((r) => r.name)
                .join(", ")}.`
            : ""
        }
        ${
          diets.length
            ? `Dietary restrictions to include: ${diets
                .map((d) => d.name)
                .join(", ")}.`
            : ""
        }
         ${
           cuisines.length
             ? `Cuisines to include: ${cuisines.map((c) => c.name).join(", ")}`
             : ""
         }
         ${
           foodAllergies.length
             ? ` Consider meal options with fool allergies: ${foodAllergies
                 .map((f) => f.name)
                 .join(", ")}.`
             : ""
         }
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

  worker.on("completed", async (job, itinerary) => {
    const data = job.data;
    logger.info(`Job ${job.id} complete for itinerary ${data.itinerary.id}`);

    // TODO - get chat response to return json with destinations and activities field
    // parse through info and create data in the db
    if ("schedule" in itinerary && Array.isArray(itinerary["schedule"])) {
      const sched = await supabaseClient
        .from("schedules")
        .insert({
          itinerary_id: data.itinerary.id,
          name: "new itinerary",
          start_date: data.itinerary.start_date,
          end_date: data.itinerary.end_date,
          duration: 90,
        })
        .select()
        .single();

      if (sched.error) {
        logger.error("Error creating schedule: ", sched.error);
        return;
      }

      for (const schedule of itinerary["schedule"]) {
        if (
          "scheduleItems" in schedule &&
          Array.isArray(schedule["scheduleItems"])
        ) {
          for (const item of schedule["scheduleItems"]) {
            const {
              name,
              description,
              startTime,
              endTime,
              duration,
              price,
              type,
              location,
            } = item;

            let locId;

            if (location && "address" in location) {
              const { address } = location;

              const addressString = [
                address.street1,
                address.street2,
                address.city,
                address.state,
                address.country,
                address.postalCode,
              ]
                .filter((x) => x)
                .join(", ");

              const hasMatchingAddress = await supabaseClient
                .from("addresses")
                .select("*")
                .match({ address_string: addressString })
                .maybeSingle();

              if (hasMatchingAddress.error) {
                logger.error(
                  "Matching address error: ",
                  hasMatchingAddress.error
                );
                continue;
              } else if (!hasMatchingAddress.data) {
                const loc = await supabaseClient
                  .from("locations")
                  .insert({
                    lat: location.lat,
                    lon: location.lon,
                  })
                  .select()
                  .single();

                if (loc.error) {
                  logger.error("Error saving location: ", loc.error);
                  continue;
                }

                locId = loc.data.id;

                const addy = await supabaseClient
                  .from("addresses")
                  .insert({
                    address_string: addressString ?? "",
                    city: address.city ?? "",
                    country: address.country ?? "",
                    postal_code: address.postalCode ?? "",
                    state: address.state ?? "",
                    street1: address.street1 ?? "",
                    street2: address.street2 ?? "",
                    location_id: loc.data.id,
                  })
                  .select()
                  .single();

                if (addy.error) {
                  logger.error("Error saving address: ", addy.error);
                  continue;
                }
              } else {
                locId = hasMatchingAddress.data.id;
              }
            }

            const data = await supabaseClient
              .from("schedule_items")
              .insert({
                name: name,
                description: description,
                duration: duration,
                start_time: startTime,
                end_time: endTime,
                schedule_id: sched.data.id,
                price: price,
                schedule_item_type: type,
                location_id: locId,
              })
              .select()
              .single();

            if (data.error) {
              logger.error("Error creating schedule_item:", data.error);
            }
          }
        }
      }
    }

    // update the itinerary status to draft mode
    await supabaseClient
      .from("itineraries")
      .update({ itinerary_status: "draft" })
      .eq("id", data.itinerary.id);
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
    job?.remove();
  });

  return worker;
}
