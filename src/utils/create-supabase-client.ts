import { createClient } from "@supabase/supabase-js";
import type { Database } from "types/database.types";
import { logger } from "./logger";

export function createSupabaseClient() {
  const client = createClient<Database>(
    Bun.env.SUPABASE_URL,
    Bun.env.SUPABASE_SERVICE_ROLE_KEY
  );
  logger.info(`Connected to Supabase: ${Bun.env.SUPABASE_URL}`);
  return client;
}
