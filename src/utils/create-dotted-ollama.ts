import { Ollama } from "ollama";
import { logger } from "./logger";

const MODEL = Bun.env.OLLAMA_MODEL;

export async function createDottedOllama() {
  const ollama = new Ollama({ host: Bun.env.OLLAMA_HOST });

  try {
    const response = await ollama.pull({ model: MODEL, stream: true });
    let progress = 0;
    for await (const res of response) {
      switch (true) {
        case res.status == "pulling manifest": {
          logger.info(`Ollama: loading model ${MODEL} started`);
          break;
        }
        case res.status.includes("pulling"): {
          const { completed, total } = res;
          if (!completed) break;

          const percentDownloaded = Math.floor((completed / total) * 100);
          if (percentDownloaded !== progress) {
            progress = percentDownloaded;
            logger.info(`Ollama: ${MODEL} ${progress}% downloaded.`);
          }

          break;
        }
        case res.status == "success": {
          logger.info(`Ollama: ${MODEL} successfully loaded`);
          break;
        }
      }
    }
  } catch (err) {
    logger.error(`Unable to pull model: ${MODEL}`, err);
  }

  return ollama;
}
