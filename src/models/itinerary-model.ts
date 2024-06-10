interface GeneratedAddress {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

interface GeneratedLocation {
  lat: number;
  lon: number;
  address: GeneratedAddress;
}

export interface GeneratedScheduleItem {
  name: string;
  type: "meal" | "accommodation" | "activity" | "transportation";
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  price?: number;
  location: GeneratedLocation;
}

export const itineraryExample: GeneratedScheduleItem[] = [
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
];
