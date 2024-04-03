import { SUPABASE_CHANNELS } from "@utils/constants";
import { supabaseClient } from "@utils/supabase";
import { handleNewItineraryCreated } from "src/subscription-handlers/itineraries";
import type { Tables } from "types/database.types";

supabaseClient
  .channel(SUPABASE_CHANNELS.new_itinerary)
  .on<Tables<"itineraries">>(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "itineraries" },
    handleNewItineraryCreated
  )
  .subscribe();
