import { tripAdvisorClient } from "src";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
import type { FunctionDeclaration } from "@google/generative-ai";

export const getLocationPhotosFunctionDeclaration: FunctionDeclaration = {
  name: "getLocationPhotos",
  description: "Search for Trip Advisors photos using the location_id",
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    description: "The query params to retrieve photos",
    properties: {
      locationId: {
        type: FunctionDeclarationSchemaType.INTEGER,
        description: "The location_id",
      },
    },
    required: ["locationId"],
  },
};

export const getLocationPhotos = ({ locationId }: { locationId: number }) => {
  return tripAdvisorClient.getLocationPhotos(locationId);
};
