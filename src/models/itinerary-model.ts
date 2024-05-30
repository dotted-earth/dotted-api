import { t } from "elysia";

const address = t.Object(
  {
    street1: t.String({
      description:
        "street1 is a required field and contains the street number and street name",
    }),
    street2: t.String({
      description:
        "street2 is an optional field that contains an apartment, unit, complex, suite, etc. number",
      default: null,
    }),
    city: t.String({
      description: "The city is a required field where this address is located",
    }),
    state: t.String({ description: "The state is a required filed" }),
    country: t.String({
      description:
        "The country is a required field where this address is located",
    }),
    postalCode: t.String({
      description:
        "The postalCode is a required field and is the postal code for this address",
    }),
  },
  {
    description:
      "The address contains a street1, street2, city, country, and postalCode field",
  }
);

const location = t.Object(
  {
    lat: t.Number({
      description:
        "The lat is a required field and is the latitude of this location",
    }),
    lon: t.Number({
      description:
        "The lon is a required field and is the longitude of this location",
    }),
    address: address,
  },
  {
    description: "The location contains the latitude, longitude, and address",
  }
);

const scheduleItem = t.Object(
  {
    name: t.String({
      description: "Name of the activity, transportation, or meal",
    }),
    type: t.Enum(
      {
        meal: "meal",
        activity: "activity",
        transportation: "transportation",
      },
      {
        description:
          "The type can only be of type meal, activity, or transportation",
      }
    ),
    description: t.String({
      description: "The description of the activity, meal, or transportation",
    }),
    startTime: t.Date({ description: "The start time of this schedule item" }),
    endTime: t.Date({ description: "The end time of this schedule item" }),
    duration: t.Integer({
      description: "The duration of the schedule item in minutes",
      examples: "90 mins",
    }),
    price: t.Number({
      description: "The price of the schedule item in United States Dollars",
      examples: "$16.00",
    }),
    location: location,
  },
  {
    description:
      "A schedule item within a schedule. It can be an activity, transportation, or meal. It is a map of fields that are: name, description, type, startTime, endTime, duration, price, and location",
  }
);

const schedule = t.Object(
  {
    date: t.Date({ description: "The date of this schedule" }),
    scheduleItems: t.Array(
      { ...scheduleItem, alternatives: t.Array(scheduleItem, { maxItems: 3 }) },
      {
        title: "itinerary",
        description:
          "A list of schedule items that contains breakfast, lunch, dinner, activities, and transportation to and from each schedule items. The alternatives field has 3 alternatives schedule items",
      }
    ),
  },
  { description: "A schedule of schedule items" }
);

export const itineraryModel = t.Object(
  {
    startDate: t.Date({ description: "The start date of the whole itinerary" }),
    endDate: t.Date({ description: "The end date of the whole itinerary" }),
    schedule: t.Array(schedule),
  },
  {
    description:
      "An itinerary that contains a schedule of activities, transportation, and meals",
    examples: {
      startDate: new Date(),
      endDate: new Date(),
      schedule: [
        {
          date: new Date(),
          scheduleItems: [
            {
              name: "Breakfast at Tiffany's",
              type: "meal",
              description: "Eat waffle and chickens at this famous location",
              startTime: "0800",
              endTime: "0900",
              duration: "60 minutes",
              price: "$20.00",
              location: {
                lat: "latitude of location",
                lon: "longitude of location",
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
              name: "Share ride",
              type: "transportation",
              description: "Commute to Opera House",
              startTime: "0915",
              endTime: "0945",
              duration: "30 minutes",
              price: "$10.00",
              location: null,
            },
            {
              name: "Opera House",
              type: "activity",
              description: "Tour the Opera House",
              startTime: "1000",
              endTime: "1200",
              duration: "120 minutes",
              price: "$50.00",
              location: {
                lat: "latitude of location",
                lon: "longitude of location",
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
              name: "Walk to Outback Steakhouse",
              type: "transportation",
              description: "Walk to Outback Steakhouse",
              startTime: "1200",
              endTime: "1215",
              duration: "15 minutes",
              price: null,
              location: null,
            },
            {
              name: "Lunch at Outback",
              type: "meal",
              description: "Eat the famous steak",
              startTime: "1220",
              endTime: "1300",
              duration: "40 minutes",
              price: "$20.00",
              location: {
                lat: "latitude of location",
                lon: "longitude of location",
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
        },
      ],
    },
  }
);

export type ItineraryModel = typeof itineraryModel;
