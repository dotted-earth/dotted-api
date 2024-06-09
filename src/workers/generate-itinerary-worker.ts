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
        start_time,
        end_time,
      } = itinerary;

      // need start time, end time, and budget
      const data = await travelAgent.runTaskAsync(
        `Generate a ${length_of_stay}-day itinerary to ${destination} where the start date is ${start_date}, start time is ${start_time} to end date is ${end_date}, and end time is ${end_time}. Make use of the full time allowed. The itinerary MUST be ${length_of_stay} days long.

        My accommodations are arranged at ${accommodation}.

        DO NOT include going to and from the airport. Use the accommodation as the starting and ending point in the itinerary but DO NOT include it in the itinerary.

        Each name field WILL be concise and ONLY be the name of the location. DO NOT repeat anything in the description from the name or the within the description itself. The description field should be at least 3 sentences long. ALWAYS suggest a restaurant for meals and NEVER suggest the same place.

        The budget for the whole trip is $${budget} USD.

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

    if ("schedule" in itinerary && Array.isArray(itinerary["schedule"])) {
      const sched = await supabaseClient
        .from("schedules")
        .insert({
          itinerary_id: data.itinerary.id,
          name: `Trip to ${data.itinerary.destination}`,
          start_date: data.itinerary.start_date,
          end_date: data.itinerary.end_date,
          duration: 90,
        })
        .select()
        .single();

      if (sched.error) {
        logger.error("Error creating schedule: ", sched.error);
        job.moveToFailed(new Error(sched.error.message), job.token!, true);
        return;
      }

      const schedules = itinerary["schedule"];

      if (schedules.length != data.itinerary.length_of_stay) {
        job.moveToFailed(
          new Error("Generated schedule length does match length of stay"),
          job.token!,
          true
        );
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
                job.moveToFailed(
                  new Error(hasMatchingAddress.error.message),
                  job.token!,
                  true
                );
                return;
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
                  logger.error("Error saving location: ", loc.error, loc);
                  job.moveToFailed(
                    new Error(loc.error.message),
                    job.token!,
                    true
                  );
                  return;
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
                  logger.error("Error saving address: ", addy.error, address);
                  job.moveToFailed(
                    new Error(addy.error.message),
                    job.token!,
                    true
                  );
                  return;
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
              logger.error("Error creating schedule_item:", data.error, item);
              job.moveToFailed(new Error(data.error.message), job.token!, true);
              return;
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
