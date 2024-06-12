import {
  getLocationPhotos,
  getLocationPhotosFunctionDeclaration,
} from "./getLocationPhotos";
import {
  searchLocationFunctionDeclaration,
  searchLocation,
} from "./searchLocation";
import type { Tool } from "@google/generative-ai";

export const tripAdvisorTools: Tool = {
  functionDeclarations: [
    searchLocationFunctionDeclaration,
    getLocationPhotosFunctionDeclaration,
  ],
};

export const toolFunctions = {
  searchLocation,
  getLocationPhotos,
};
