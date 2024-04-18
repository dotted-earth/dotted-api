import "@utils/supabase";
import Elysia from "elysia";
import { logger } from "@utils/logger";
import { waitListServices } from "./services/wait-list";
import { itinerariesServices } from "./services/itinerary";

new Elysia()
  .use(waitListServices)
  .use(itinerariesServices)
  .listen(Bun.env.PORT, () => {
    logger.info(`app starting on PORT: ${Bun.env.PORT}`);
  });
