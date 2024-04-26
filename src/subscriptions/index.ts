import { supabaseNewItinerarySubscription } from "./itineraries";
import { supabaseClient } from "@utils/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export function subscribeToSupabaseEvents() {
  const subscriptions: Array<(client: SupabaseClient) => void> = [
    supabaseNewItinerarySubscription,
  ];

  for (const subscription of subscriptions) {
    subscription(supabaseClient);
  }
}
