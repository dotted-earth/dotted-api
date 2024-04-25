import Queue from "bee-queue";
import { createClient } from "redis";

const redis = createClient({});

export function newQueue<T>(
  name: string,
  settings?: Queue.QueueSettings | undefined
) {
  return new Queue<T>(name, {
    ...settings,
    redis,
  });
}
