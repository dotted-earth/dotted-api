import Queue from "bee-queue";
import { createClient } from "redis";
import { logger } from "./logger";

async function createRedisClient() {
  try {
    return await createClient({
      socket: {
        host: Bun.env.REDIS_HOST,
        port: 6379,
      },
    }).connect();
  } catch (error) {
    logger.error("Redis Client Error", error);
  }
}

export const redis = await createRedisClient();

export function newQueue<T>(
  name: string,
  settings?: Queue.QueueSettings | undefined
) {
  return new Queue<T>(name, {
    ...settings,
    redis,
  });
}
