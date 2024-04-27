import type { Tables } from "types/database.types";

export type GenerateItineraryJobData = {
  recreations: Tables<"recreations">[];
  diets: Tables<"diets">[];
  cuisines: Tables<"cuisines">[];
  foodAllergies: Tables<"food_allergies">[];
  itinerary: Tables<"itineraries">;
};
