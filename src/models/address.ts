export type Address = {
  id: number;
  street1: string;
  street2?: string | null;
  building?: string | null;
  floor?: string | null;
  postalCode?: string | null;
};
