import { supabaseClient } from "@utils/supabase";
import { logger } from "@utils/logger";
import { generateItineraryQueue } from "src/workers/generate-itinerary";

import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import type { Tables } from "types/database-generated.types";

export async function handleNewItineraryCreated(
  payload: RealtimePostgresInsertPayload<Tables<"itineraries">>
) {
  try {
    logger.info("new itinerary created");

    // query user's preferences from the itinerary that was created
    const [recreations, diets, cuisines, foodAllergies] = await Promise.all([
      supabaseClient
        .from("user_recreations")
        .select("recreations(*)")
        .eq("user_id", payload.new.user_id)
        .then((res) => res.data?.flatMap((d) => d.recreations ?? []) ?? []),
      supabaseClient
        .from("user_diets")
        .select("diets(*)")
        .eq("user_id", payload.new.user_id)
        .then((res) => res.data?.flatMap((d) => d.diets ?? []) ?? []),
      supabaseClient
        .from("user_cuisines")
        .select("cuisines(*)")
        .eq("user_id", payload.new.user_id)
        .then((res) => res.data?.flatMap((d) => d.cuisines ?? []) ?? []),
      supabaseClient
        .from("user_food_allergies")
        .select("food_allergies(*)")
        .eq("user_id", payload.new.user_id)
        .then((res) => res.data?.flatMap((d) => d.food_allergies ?? []) ?? []),
    ]);

    // send user preferences and itinerary to ai generate itinerary task queue
    generateItineraryQueue.createJob({
      recreations,
      diets,
      cuisines,
      foodAllergies,
      itinerary: payload.new,
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message, err);
    }
  }
}
