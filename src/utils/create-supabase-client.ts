import { createClient } from "@supabase/supabase-js";
import type { Database } from "types/database.types";

export function createSupabaseClient() {
  return createClient<Database>(
    Bun.env.SUPABASE_URL,
    Bun.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
