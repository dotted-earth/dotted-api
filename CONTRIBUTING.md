# CONTRIBUTING

Set up dev environment

## Prerequisites

1. Install Bun.sh, `curl -fsSL https://bun.sh/install | bash`

## Install dependencies

1. `bun install`

## Login to Supabase

1. `bunx supabase login`

## Generate Supabase Schemas

1. `bunx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > types/supabase.ts`

## Run server

1. `bun dev`
