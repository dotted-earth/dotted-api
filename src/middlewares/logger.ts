import { MiddlewareHandler } from "hono";
import { logger } from "@utils/logger";

export const middlewareLogger = () => {
  return (async (context, next) => {
    const timeStart = Date.now();
    await next();

    const timeElapsed = `${Date.now() - timeStart}ms`;
    const { req, error, res } = context;
    const { method, path } = req;
    const { status } = res;
    const message = `${method} ${path} ${status} ${timeElapsed}`;
    if (error && error instanceof Error) {
      logger.error(`${message} ${error.message}`, error);
    } else if (status > 0 && status < 400) {
      logger.info(message);
    } else if (status < 500) {
      logger.warn(message);
    } else {
      logger.error(message);
    }
  }) as MiddlewareHandler;
};
