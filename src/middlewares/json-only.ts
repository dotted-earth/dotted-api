import type { MiddlewareHandler } from "hono";

export const jsonOnly = () => {
  return (async (context, next) => {
    if (context.req.header("Content-Type") !== "application/json") {
      return context.json(
        {
          error: "Unsupported Media Type",
          message: "Invalid Headers",
        },
        415,
        {
          "accept-encoding": "application/json",
        }
      );
    }

    await next();
  }) as MiddlewareHandler;
};
