# CONTRIBUTING

Set up dev environment

## Set-up Options

1. [Docker Set-up](#docker-set-up)
2. [Traditional Set-up]("#traditional-set-up")

## Docker Set-up

### Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)

### Run App

2. `docker compose up`

## Traditional Set-up

### Prerequisites

1. Install Bun.sh, `curl -fsSL https://bun.sh/install | bash`
2. Install Redis

### Install dependencies

1. `bun install`

### Snaplet

1. Signup for [Snaplet](https://snaplet.dev) account

### Download Supabase CLI

1. `brew install supabase/tap/supabase`
2. Fill out .env completely
3. Install Docker Desktop and have it running
4. Run `supabase start` to start containers
5. Run migrations `supabase db reset`
6. Seed db with `bun seed`
7. For reference, use [Supabase CLI docs](https://supabase.com/docs/guides/cli/local-development)

### Login to Supabase

1. `bunx supabase login`

### Generate Supabase Schemas

1. `bunx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > types/supabase.ts`

### Run server

1. `bun dev`
