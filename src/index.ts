import { logger } from "@utils/logger";
import "@utils/supabase";
import { Hono } from "hono";

logger.info(`app starting on PORT: ${Bun.env.PORT}`);
const app = new Hono();

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
