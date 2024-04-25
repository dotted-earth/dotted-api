import Elysia, { t } from "elysia";
import { dottedOllama } from "@utils/constants";

export const itinerariesServices = new Elysia({ prefix: "/itineraries" }).post(
  "/generate",
  async ({ body }) => {
    const response = await dottedOllama.chat({
      model: "mistral",
      messages: [
        { content: "In one sentence, what is USA like?", role: "user" },
      ],
      stream: true,
    });

    let messages = "";
    for await (const res of response) {
      messages += res.message.content;
    }

    return { message: messages.trim() };
  },
  {
    body: t.Object({
      userId: t.String({ error: "invalid user id" }),
      itineraryId: t.String({ error: "invalid itinerary id" }),
    }),
  }
);
