import { Ollama } from "ollama";

export const SUPABASE_CHANNELS = {
  new_itinerary: "new_itinerary",
} as const;

export const dottedOllama = new Ollama({ host: process.env.OLLAMA_HOST });
