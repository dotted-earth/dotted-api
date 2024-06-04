export type ViatorV1ResponseSchema<T> = {
  errorReference: string | null;
  dateStamp: string | null;
  errorType: string | null;
  errorCodes: string[] | null;
  errorMessage: string[][] | null;
  errorName: string | null;
  extraInfo: object | null;
  extraObject: object | null;
  success: boolean | null;
  totalCount: number | null;
  errorMessageText: string | null;
  vmid: string | null;
  data: T[];
};

export type Destination = {
  sortOrder: number;
  selectable: boolean;
  destinationUrlName: string;
  defaultCurrencyCode: string;
  lookupId: string;
  parentId: number;
  timeZone: string;
  iataCode: string | null;
  destinationName: string;
  destinationType: "CITY" | "COUNTRY" | "REGION";
  destinationId: number;
  latitude: number;
  longitude: number;
};

export type Attraction = {
  sortOrder: number;
  webURL: string | null;
  pageUrlName: string;
  primaryDestinationUrlName: string;
  publishedDate: string;
  attractionLatitude: number;
  attractionLongitude: number;
  attractionStreetAddress: string;
  attractionCity: string;
  attractionState: string;
  destinationId: number;
  photoCount: number;
  primaryDestinationId: number;
  thumbnailHiResURL: string;
  primaryDestinationName: string;
  thumbnailURL: string;
  seoId: number;
  productCount: number;
  rating: number;
  title: string;
};
