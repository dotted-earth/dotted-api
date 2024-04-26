import "@utils/supabase";
import Elysia from "elysia";
import { logger } from "@utils/logger";
import { waitListServices } from "./services/wait-list";
import { itinerariesServices } from "./services/itinerary";
import { redis } from "@utils/bee-queue";

if (redis?.isOpen) {
  logger.info("app connected to Redis");
} else {
  logger.error("app cannot connect to Redis");
}

new Elysia()
  .use(waitListServices)
  .use(itinerariesServices)
  .listen(Bun.env.PORT, () => {
    logger.info(`app starting on PORT: ${Bun.env.PORT}`);
  });
