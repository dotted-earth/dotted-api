import { z } from "zod";

const schemaScheduleItem = z.object({
  name: z.string(),
  type: z.enum(["meal", "activity", "transportation"]),
  description: z.string(),
  startTime: z.string().datetime({ local: true }),
  endTime: z.string().datetime({ local: true }),
  duration: z.number().positive().int(),
  price: z.number().gte(0).nullable(),
  location: z.object({
    lat: z.number(),
    lon: z.number(),
    address: z.object({
      street1: z.string(),
      street2: z.string().nullable(),
      city: z.string(),
      state: z.string().nullable(),
      country: z.string(),
      postalCode: z.string().nullable(),
    }),
  }),
});

export const generatedItineraryDraft = z.object({
  accommodation: z.object({
    name: z.string(),
    description: z.string(),
    location: z.object({
      lat: z.number(),
      lon: z.number(),
      address: z.object({
        street1: z.string(),
        street2: z.string().nullable(),
        city: z.string(),
        state: z.string().nullable(),
        country: z.string(),
        postalCode: z.string().nullable(),
      }),
    }),
  }),
  scheduleItems: z.array(schemaScheduleItem),
});

export type GeneratedItinerary = z.infer<typeof generatedItineraryDraft>;

export const itineraryExample: GeneratedItinerary = {
  accommodation: {
    name: "Marriot Sydney Australia",
    description: "Located in the heart of Sydney is this beautiful grand hotel",
    location: {
      lat: -21.0,
      lon: 121.0,
      address: {
        street1: "578 Koala Street",
        street2: null,
        city: "Sydney",
        state: null,
        country: "Australia",
        postalCode: "78192",
      },
    },
  },
  scheduleItems: [
    {
      name: "Tiffany's",
      type: "meal",
      description: "Eat waffle and chickens at this famous location",
      startTime: new Date(2024, 4, 17, 8, 0, 0).toISOString(),
      endTime: new Date(2024, 4, 17, 9, 0, 0).toISOString(),
      duration: 60,
      price: 20.5,
      location: {
        lat: 10.345988,
        lon: 107.084715,
        address: {
          street1: "123 fake street",
          street2: "unit 32",
          city: "Sydney",
          state: "South Wales",
          country: "Australia",
          postalCode: "11029",
        },
      },
    },
    {
      name: "Opera House",
      type: "activity",
      description: "Tour the Opera House",
      startTime: new Date(2024, 4, 17, 10, 0, 0).toISOString(),
      endTime: new Date(2024, 4, 17, 12, 0, 0).toISOString(),
      duration: 120,
      price: 50.0,
      location: {
        lat: 10.345988,
        lon: 107.084715,
        address: {
          street1: "123 fake street",
          street2: "unit 32",
          city: "Sydney",
          state: "South Wales",
          country: "Australia",
          postalCode: "11029",
        },
      },
    },
    {
      name: "Outback Steakhouse",
      type: "meal",
      description: "Eat the famous steak",
      startTime: new Date(2024, 4, 17, 12, 20, 0).toISOString(),
      endTime: new Date(2024, 4, 17, 13, 0, 0).toISOString(),
      duration: 40,
      price: 20.1,
      location: {
        lat: 10.345988,
        lon: 107.084715,
        address: {
          street1: "123 fake street",
          street2: "unit 32",
          city: "Sydney",
          state: "South Wales",
          country: "Australia",
          postalCode: "11029",
        },
      },
    },
  ],
};
