import { supabaseClient } from "@utils/supabase";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import type { Tables } from "types/database-generated.types";
import { logger } from "@utils/logger";

export async function handleNewItineraryCreated(
  payload: RealtimePostgresInsertPayload<Tables<"itineraries">>
) {
  try {
    // put in task queue for AI generation
    logger.info("new itinerary created");
    // query user's preferences
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

    console.log(recreations, cuisines, diets, foodAllergies);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}
