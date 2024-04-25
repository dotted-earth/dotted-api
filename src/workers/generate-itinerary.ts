import { logger } from "@utils/logger";
import { dottedOllama } from "@utils/constants";
import { newQueue } from "@utils/beequeue";
import type Queue from "bee-queue";
import type { Tables } from "types/database.types";

type GenerateItineraryJobData = {
  recreations: Tables<"recreations">[];
  diets: Tables<"diets">[];
  cuisines: Tables<"cuisines">[];
  foodAllergies: Tables<"food_allergies">[];
  itinerary: Tables<"itineraries">;
};

export const generateItineraryQueue =
  newQueue<GenerateItineraryJobData>("generate_itinerary");

// this is where the magic happens and we generate an itinerary
generateItineraryQueue.process(
  10,
  async (
    job: Queue.Job<GenerateItineraryJobData>,
    done: Queue.DoneCallback<boolean>
  ) => {
    const { itinerary } = job.data;
    logger.info(`Job ${job.id} for itinerary ${itinerary.id} processing...`);
    // do something with jobs
    // const prompt = `I am traveling to ${itinerary.destination}. I am staying for ${itinerary.length_of_stay} days and my budget is $${itinerary.budget} USD`;
    const testPrompt = "In one sentence, describe yourself";

    try {
      const response = await dottedOllama.chat({
        model: "mistral",
        messages: [{ content: testPrompt, role: "user" }],
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    done(null, true);
  }
);
