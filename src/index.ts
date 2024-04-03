import "@utils/supabase";
import { logger } from "@utils/logger";
import { Hono } from "hono";
import { middlewareLogger } from "./middlewares/logger";
import { jsonOnly } from "./middlewares/json-only";
import { waitListService } from "./services/wait-list";

logger.info(`app starting on PORT: ${Bun.env.PORT}`);

const app = new Hono();

app.use(middlewareLogger());
app.use(jsonOnly());

app.route("/wait-list", waitListService);

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
