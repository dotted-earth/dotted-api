declare module "bun" {
  interface Env {
    PORT: string;
    SUPABASE_PROJECT_ID: string;
    SUPABASE_URL: string;
    SUPABASE_SECRET: string;
    OLLAMA_HOST: string;
    REDIS_HOST: string;
  }
}
