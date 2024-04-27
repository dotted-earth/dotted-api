import Redis, { type RedisOptions } from "ioredis";
import { logger } from "./logger";

export const redisOpts: RedisOptions = {
  host: Bun.env.REDIS_HOST,
  port: 6379,
};

export function createRedisClient(opts?: RedisOptions) {
  logger.info("Creating to Redis...");
  return new Redis({
    ...redisOpts,
    ...opts,
  });
}
