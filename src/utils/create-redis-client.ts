import Redis, { type RedisOptions } from "ioredis";

export const redisOpts: RedisOptions = {
  host: Bun.env.REDIS_HOST,
  port: 6379,
};

export function createRedisClient(opts?: RedisOptions) {
  return new Redis({
    ...redisOpts,
    ...opts,
  });
}
