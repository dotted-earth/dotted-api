import { createClient } from "@supabase/supabase-js";
import type { Database } from "types/database.types";
import { logger } from "./logger";

logger.info("creating Supabase client");
export const supabaseClient = createClient<Database>(
  Bun.env.SUPABASE_URL,
  Bun.env.SUPABASE_SECRET
);
