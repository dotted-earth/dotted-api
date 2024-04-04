import { logger } from "@utils/logger";
import Queue from "bee-queue";
import type { Tables } from "types/database.types";

type GenerateItineraryJobData = {
  recreations: Tables<"recreations">[];
  diets: Tables<"diets">[];
  cuisines: Tables<"cuisines">[];
  foodAllergies: Tables<"food_allergies">[];
  itinerary: Tables<"itineraries">;
};

export const generateItineraryQueue = new Queue<GenerateItineraryJobData>(
  "generate_itinerary"
);

// this is where the magic happens and we generate an itinerary
generateItineraryQueue.process(
  10,
  (
    job: Queue.Job<GenerateItineraryJobData>,
    done: Queue.DoneCallback<boolean>
  ) => {
    const { itinerary } = job.data;
    logger.info(`Job ${job.id} for itinerary ${itinerary.id} processing...`);
    // do something with jobs
    const prompt = `I am traveling to ${itinerary.destination}. I am staying for ${itinerary.length_of_stay} days and my budget is $${itinerary.budget} USD`;
    console.log(prompt);

    done(null, true);
  }
);
