import { tripAdvisorClient } from "src";

export const searchLocationFunctionDeclaration = {
  name: "searchLocation",
  parameters: {
    type: "OBJECT",
    description: "Get the photos from a location",
    properties: {
      searchQuery: {
        type: "STRING",
        description: "The name of the location",
      },
      latLong: {
        type: "STRING",
        description:
          'The latitude and longitude of the location - eg. "42.3455,-71.10767"',
      },
      address: {
        type: "STRING",
        description: "The address of the location",
      },
    },
    required: ["searchQuery"],
  },
};

export function searchLocation(params: {
  searchQuery: string;
  latLong?: string;
  address?: string;
}) {
  return tripAdvisorClient.searchLocation(params);
}
