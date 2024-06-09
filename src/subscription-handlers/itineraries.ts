import { logger } from "@utils/logger";
import { uuidv7 } from "uuidv7";

import type {
  RealtimePostgresInsertPayload,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Tables } from "types/database-generated.types";
import type { Queue } from "bullmq";
import type { GenerateItineraryJobData } from "src/types/generate-itinerary-job-data";
import { TASK } from "@utils/constants";

export function handleNewItineraryCreated(
  supabaseClient: SupabaseClient,
  queue: Queue<GenerateItineraryJobData>
) {
  return async (
    payload: RealtimePostgresInsertPayload<Tables<"itineraries">>
  ) => {
    try {
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
          .then(
            (res) => res.data?.flatMap((d) => d.food_allergies ?? []) ?? []
          ),
      ]);

      // send user preferences and itinerary to ai generate itinerary task queue
      const jobId = uuidv7();

      const job = await queue.add(
        TASK.generate_itinerary,
        {
          recreations,
          diets,
          cuisines,
          foodAllergies,
          itinerary: payload.new,
        },
        {
          jobId,
          removeOnComplete: true,
        }
      );

      logger.info(`Generate itinerary job ${job.id} created`);
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message, err);
      }
    }
  };
}
