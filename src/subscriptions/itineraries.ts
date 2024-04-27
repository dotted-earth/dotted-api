import { logger } from "@utils/logger";
import { SUPABASE_CHANNELS } from "@utils/constants";
import { handleNewItineraryCreated } from "src/subscription-handlers/itineraries";
import type { Tables } from "types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Queue } from "bullmq";
import type { GenerateItineraryJobData } from "src/types/generate-itinerary-job-data";

export function supabaseNewItinerarySubscription(
  supabaseClient: SupabaseClient,
  queue: Queue<GenerateItineraryJobData>
) {
  supabaseClient
    .channel(SUPABASE_CHANNELS.new_itinerary)
    .on<Tables<"itineraries">>(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "itineraries" },
      handleNewItineraryCreated(supabaseClient, queue)
    )
    .subscribe((status) => {
      switch (status) {
        case "SUBSCRIBED": {
          logger.info(
            `Subscribed to Supabase Real-time Changes: ${SUPABASE_CHANNELS.new_itinerary}`
          );
        }
      }
    });
}
