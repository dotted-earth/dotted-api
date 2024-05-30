import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database-generated.types";

declare module "bun" {
  interface Env {
    PORT: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    REDIS_HOST: string;
    GOOGLE_GEMINI_AI_KEY: string;
    VIATOR_API_KEY: string;
    TURSO_DATABASE_URL: string;
    TURSO_AUTH_TOKEN: string;
  }
}

type DottedSupabase = SupabaseClient<Database>;
