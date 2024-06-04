import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const viatorAttractions = sqliteTable("attractions", {
  seoId: integer("seoId"),
  sortOrder: integer("sortOrder").notNull(),
  webURL: text("webURL"),
  pageUrlName: text("pageUrlName"),
  primaryDestinationUrlName: text("primaryDestinationUrlName"),
  publishedDate: text("publishedDate"),
  attractionLatitude: real("attractionLatitude"),
  attractionLongitude: real("attractionLongitude"),
  attractionStreetAddress: text("attractionStreetAddress"),
  attractionCity: text("attractionCity"),
  attractionState: text("attractionState"),
  destinationId: integer("destinationId"),
  photoCount: integer("photoCount"),
  primaryDestinationId: integer("primaryDestinationId"),
  thumbnailHiResURL: text("thumbnailHiResURL"),
  primaryDestinationName: text("primaryDestinationName"),
  thumbnailURL: text("thumbnailURL"),
  productCount: integer("productCount"),
  rating: integer("rating"),
  title: text("title"),
});

export const viatorDestinations = sqliteTable("destinations", {
  destinationId: integer("destinationId"),
  sortOrder: integer("sortNumber"),
  selectable: integer("selectable", { mode: "boolean" }),
  destinationUrlName: text("destinationUrlName"),
  defaultCurrencyCode: text("defaultCurrencyCode"),
  lookupId: text("lookupId"),
  parentId: integer("parentId"),
  timeZone: text("timeZone"),
  iataCode: text("iataCode"),
  destinationName: text("destinationName"),
  destinationType: text("destinationType", {
    enum: ["CITY", "COUNTRY", "REGION"],
  }),
  latitude: real("latitude"),
  longitude: real("longitude"),
});
