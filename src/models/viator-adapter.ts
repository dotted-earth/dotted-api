export type ViatorAdapter = {
  id: number;
  locationId: number; // our local identifier
  destId: number; // viators destination id
  attractionId?: number;
};
