import { tripAdvisorClient } from "src";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
import type { FunctionDeclaration } from "@google/generative-ai";

export const searchLocationFunctionDeclaration: FunctionDeclaration = {
  name: "searchLocation",
  description: "Search Trip Advisors Content for a location",
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    description: "Search for a location",
    properties: {
      searchQuery: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "The name of the location",
      },
      latLong: {
        type: FunctionDeclarationSchemaType.STRING,
        description:
          'The latitude and longitude of the location - eg. "42.3455,-71.10767"',
      },
      address: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "The address of the location",
      },
    },
    required: ["searchQuery"],
  },
};

export const searchLocation = (params: {
  searchQuery: string;
  latLong?: string;
  address?: string;
}) => {
  return tripAdvisorClient.searchLocation(params);
};
