# CONTRIBUTING

Set up dev environment

## Prerequisites

1. Install Bun.sh, `curl -fsSL https://bun.sh/install | bash`
2. Install Redis
3. Get API keys

### Install dependencies

1. `bun install`

### Snaplet

1. Signup for [Snaplet](https://snaplet.dev) account

### Download Supabase CLI

1. `brew install supabase/tap/supabase`
2. Fill out .env completely
3. Install Docker Desktop and have it running
4. Run `supabase start` to start containers

   Should yield:

   ```
    API URL: http://127.0.0.1:54321
    GraphQL URL: http://127.0.0.1:54321/graphql/v1
    S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
    DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
    Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
   ```

5. Enter your `service_role key` into `.env` for `SUPABASE_SERVICE_ROLE_KEY` and `API URL` for `SUPABASE_URL`
6. Run migrations `supabase db reset`
7. For reference, use [Supabase CLI docs](https://supabase.com/docs/guides/cli/local-development)

### Login to Supabase

1. `bunx supabase login`

### Generate Supabase Migrations

1. `supabase db diff -f <migration_file_name>`

### Generate Supabase Schemas

1. `bun types:supabase`

### Run server

1. `bun dev`

### Run with Docker

1. `docker compose up --build`
2. `docker compose down`
3. `docker compose up --watch`
