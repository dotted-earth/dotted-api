import { logger } from "@utils/logger";
import { Worker } from "bullmq";
import { QUEUE_NAME, TASK } from "@utils/constants";
import { createRedisClient } from "@utils/create-redis-client";
import { AiAgent } from "@utils/google-gemini-agent";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import {
  itineraryExample,
  generatedItineraryDraft,
} from "src/models/itinerary-model";

import type { GenerateItineraryJobData } from "src/types/generate-itinerary-job-data";
import type { GeneratedItinerary } from "src/models/itinerary-model";
import type { DottedSupabase } from "types";
import type { Database } from "types/database.types";

export function generateItineraryWorker(supabaseClient: DottedSupabase) {
  const worker = new Worker<
    GenerateItineraryJobData,
    GeneratedItinerary,
    typeof TASK.generate_itinerary
  >(
    QUEUE_NAME.itinerary,
    async (job) => {
      const { itinerary, cuisines, diets, foodAllergies, recreations } =
        job.data;
      logger.info(`Job ${job.id} for itinerary ${itinerary.id} processing...`);

      const travelAgent = new AiAgent({
        model: "gemini-1.5-flash",
        role: "You are an expert travel agent",
        outputJson: itineraryExample,
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
        `Generate a ${length_of_stay}-day itinerary to ${destination} where the start date is ${start_date} to end date is ${end_date}. Make use of the full time allowed. The itinerary MUST be ${length_of_stay} days long.

        My accommodations are arranged at ${accommodation}. The budget for the whole trip is $${budget} USD.

        DO NOT include going to and from the airport. Use the accommodation as the starting and ending point in the itinerary but DO NOT include it in the itinerary.
        DO NOT repeat anything in the description from the name or the within the description itself.
        ALWAYS provide 3 meals a day if time is allowed and NEVER suggest the same restaurant.
        ENSURE that the restaurant is open for business.
        Each name field WILL be concise and ONLY be the name of the location.
        The description field should be at least 3 sentences long.

        A schedule_item type can ONLY be one of: meal or activity.

        The schedule items should be in chronological order.

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

         Output format should ALWAYS be a JSON and the output should be structured like in the following JSON:
         ${JSON.stringify(itineraryExample)}
        `
      );

      // Set up a parser
      const parser = new JsonOutputParser();
      const itineraryDraft = await parser.parse(data.response.text());

      return generatedItineraryDraft.parse(itineraryDraft);
    },
    {
      connection: createRedisClient({ maxRetriesPerRequest: null }),
    }
  );

  worker.on("completed", async (job, generatedItinerary) => {
    const data = job.data;
    logger.info(`Job ${job.id} complete for itinerary ${data.itinerary.id}`);

    const accommodation = generatedItinerary.accommodation;

    const accommodationLocation = await supabaseClient
      .from("locations")
      .upsert(
        {
          lat: accommodation.location.lat,
          lon: accommodation.location.lon,
        },
        { ignoreDuplicates: false }
      )
      .select()
      .single();

    if (accommodationLocation.error) {
      throw new Error(
        `Accommodation insert error: ${accommodationLocation.error}`
      );
    }

    const accommodationAddressString = [
      accommodation.location.address.street1,
      accommodation.location.address.street2,
      accommodation.location.address.city,
      accommodation.location.address.state,
      accommodation.location.address.country,
      accommodation.location.address.postalCode,
    ]
      .filter((x) => Boolean(x))
      .join(", ");

    const accommodationAddress = await supabaseClient
      .from("addresses")
      .upsert(
        {
          street1: accommodation.location.address.street1,
          street2: accommodation.location.address.street2,
          city: accommodation.location.address.city,
          state: accommodation.location.address.state,
          country: accommodation.location.address.country,
          postal_code: accommodation.location.address.postalCode,
          address_string: accommodationAddressString,
          location_id: accommodationLocation.data!.id,
        },
        { ignoreDuplicates: false }
      )
      .select()
      .single();

    const pointOfInterest = await supabaseClient
      .from("point_of_interests")
      .upsert(
        {
          name: accommodation.name,
          description: accommodation.description,
          location_id: accommodationLocation.data!.id,
          address_id: accommodationAddress.data!.id,
        },
        { ignoreDuplicates: false }
      )
      .select("*,location:locations(*)")
      .single();

    if (pointOfInterest.error) {
      throw new Error(
        `Accommodation Point of Interest error: ${pointOfInterest.error}`
      );
    }

    const generatedScheduleItems = generatedItinerary.scheduleItems;
    const scheduleItemsMap: Map<
      string,
      (Database["public"]["Tables"]["schedule_items"]["Row"] & {
        point_of_interest:
          | (Database["public"]["Tables"]["point_of_interests"]["Row"] & {
              location: Database["public"]["Tables"]["locations"]["Row"] | null;
            })
          | null;
      })[]
    > = new Map();

    for (const scheduleItem of generatedScheduleItems) {
      const {
        name,
        description,
        startTime,
        endTime,
        duration,
        price,
        type,
        location,
      } = scheduleItem;

      let locId: number;
      let addressId: number;

      if (location && location.address) {
        const { address } = location;

        const addressString = [
          address.street1,
          address.street2,
          address.city,
          address.state,
          address.country,
          address.postalCode,
        ]
          .filter((x) => Boolean(x))
          .join(", ");

        const hasMatchingAddress = await supabaseClient
          .from("addresses")
          .select("*")
          .match({ address_string: addressString })
          .maybeSingle();

        if (hasMatchingAddress.error) {
          throw new Error(
            `Matching address error: ${hasMatchingAddress.error.message}`
          );
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
            throw new Error(`Error saving location: ${loc.error.message}`);
          }

          locId = loc.data.id;

          const addressData = await supabaseClient
            .from("addresses")
            .insert({
              street1: address.street1,
              street2: address.street2,
              city: address.city,
              state: address.state,
              country: address.country,
              postal_code: address.postalCode,
              address_string: addressString,
              location_id: loc.data.id,
            })
            .select()
            .single();

          if (addressData.error) {
            throw new Error(
              `Error saving address: ${addressData.error.message}`
            );
          }

          addressId = addressData.data.id;
        } else {
          addressId = hasMatchingAddress.data.id;
          locId = hasMatchingAddress.data.location_id;
        }

        const pointOfInterestsData = await supabaseClient
          .from("point_of_interests")
          .insert({
            name: name,
            description: description,
            location_id: locId,
            address_id: addressId,
          })
          .select("*,location:locations(*)")
          .single();

        if (pointOfInterestsData.error) {
          throw new Error(
            `Error saving point_of_interests: ${pointOfInterestsData.error.message}`
          );
        }

        const scheduleItemData = await supabaseClient
          .from("schedule_items")
          .insert({
            itinerary_id: data.itinerary.id,
            duration: duration,
            start_time: startTime,
            end_time: endTime,
            schedule_item_type: type,
            point_of_interest_id: pointOfInterestsData.data.id,
            price: price != null ? parseFloat(price.toFixed(2)) : null,
          })
          .select(
            "*,point_of_interest:point_of_interests(*,location:locations(*))"
          )
          .single();

        if (scheduleItemData.error) {
          throw new Error(
            `Error saving schedule_items: ${scheduleItemData.error.message}`
          );
        }

        // add to a map so we can create routes per day
        const date = new Date(scheduleItem.startTime);
        const dateString = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;

        const hasMappedItem = scheduleItemsMap.has(dateString);
        if (hasMappedItem) {
          scheduleItemsMap.set(
            dateString,
            scheduleItemsMap.get(dateString)?.concat(scheduleItemData.data) ??
              []
          );
        } else {
          scheduleItemsMap.set(dateString, [scheduleItemData.data]);
        }

        // TODO: Find media pictures for schedule item
      }
    }

    // Create routes between each point for each day with the start and end at the accommodation

    console.log(scheduleItemsMap);

    // const googleDirections = await Promise.allSettled(
    //   points.map(([oPoint, dPoint]) =>
    //     googleMapsClient.directions({
    //       params: {
    //         key: Bun.env.GOOGLE_MAPS_API_KEY,
    //         origin: `${oPoint!.lat},${oPoint!.lon}`,
    //         destination: dPoint
    //           ? `${dPoint.lat},${dPoint.lon}`
    //           : `${pointOfInterests[0].location?.lat},${pointOfInterests[0].location?.lon}`,
    //       },
    //     })
    //   )
    // ).then((res) =>
    //   res.map((r) => (r.status === "fulfilled" ? r.value.data : null))
    // );

    // googleDirections.forEach((dir) => {
    //   console.log(dir?.available_travel_modes);
    //   console.log(dir?.routes.map((r) => r));
    //   console.log(dir?.geocoded_waypoints.map((wy) => wy));
    // });

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
