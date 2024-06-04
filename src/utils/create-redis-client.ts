import Redis, { type RedisOptions } from "ioredis";
import { logger } from "./logger";

export const redisOpts: RedisOptions = {
  host: Bun.env.REDIS_HOST,
  port: 6379,
};

export function createRedisClient(opts?: RedisOptions) {
  const client = new Redis({
    ...redisOpts,
    ...opts,
  });

  logger.info(`Connected to Redis on ${Bun.env.REDIS_HOST}:6379`);
  return client;
}
