import type { Address } from "./address";

export type Location = {
  id: number;
  parentId: Location["id"] | null;
  name: string;
  description: string | null;
  lat: number;
  lon: number;
  address: Address | null;
  city: string | null;
  state: string | null;
  country: string | null;
  fullAddressName: string | null;
  childIds: Location["id"][];
};
