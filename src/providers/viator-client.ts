import type {
  ViatorV1ResponseSchema,
  Destination,
  Attraction,
} from "src/models/viator-response";

export class ViatorClient {
  private _baseUrl =
    Bun.env.NODE_ENV === "development"
      ? "https://api.sandbox.viator.com/partner"
      : "";
  private _options: RequestInit;

  constructor({ apiKey }: { apiKey: string }) {
    this._options = {
      headers: {
        "exp-api-key": apiKey,
        "accept-language": "en-US",
        "content-type": "application/json",
      },
    };
  }

  async getDestinations() {
    const data = await fetch(this._baseUrl + "/v1/taxonomy/destinations", {
      ...this._options,
      method: "get",
    }).then(
      (res) => res.json() as Promise<ViatorV1ResponseSchema<Destination>>
    );

    return data;
  }

  async getAttractions(reqBody: {
    destId: number;
    topX?: string;
    sortOrder?: "RECOMMENDED" | "SEO_ALPHABETICAL";
  }) {
    const data = await fetch(this._baseUrl + `/v1/taxonomy/attractions`, {
      ...this._options,
      method: "post",
      body: JSON.stringify(reqBody),
    }).then((res) => res.json() as Promise<ViatorV1ResponseSchema<Attraction>>);

    return data;
  }
}
