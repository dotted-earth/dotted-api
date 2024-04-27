import { createClient } from "@supabase/supabase-js";
import type { Database } from "types/database.types";
import { logger } from "./logger";

export function createSupabaseClient() {
  logger.info("creating Supabase client");
  return createClient<Database>(Bun.env.SUPABASE_URL, Bun.env.SUPABASE_SECRET);
}
