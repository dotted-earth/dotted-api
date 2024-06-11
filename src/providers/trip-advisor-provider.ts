import type {
  TripAdvisorLocationDetails,
  TripAdvisorLocationPhoto,
  TripAdvisorLocationSearch,
  TripAdvisorPaginatedResponse,
  TripAdvisorResponse,
} from "src/models/trip-advisor-response";

export class TripAdvisorProvider {
  private _baseUrl = "https://api.content.tripadvisor.com/api/v1";
  private _apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this._apiKey = apiKey;
  }

  private _makeQueryParams(params?: Record<string, string | number>): string {
    if (!params) return "";

    const URLParams = new URLSearchParams({ ...params, key: this._apiKey });
    return "?" + URLParams.toString();
  }

  searchLocation(params: {
    searchQuery: string;
    category?: string;
    phone?: string;
    latLong?: string;
    radius?: number;
    radiusUnit?: string;
    language?: string;
  }): Promise<TripAdvisorResponse<TripAdvisorLocationSearch>> {
    console.log(
      `${this._baseUrl}/location/search${this._makeQueryParams(params)}`
    );
    return fetch(
      `${this._baseUrl}/location/search${this._makeQueryParams(params)}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    ).then(
      (res) =>
        res.json() as Promise<TripAdvisorResponse<TripAdvisorLocationSearch>>
    );
  }

  getLocationDetails(
    locationId: number,
    params?: {
      language?: string;
      currency?: string;
    }
  ): Promise<TripAdvisorResponse<TripAdvisorLocationDetails>> {
    return fetch(
      `${this._baseUrl}/location/${locationId}/details${this._makeQueryParams(
        params
      )}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    ).then(
      (res) =>
        res.json() as Promise<TripAdvisorResponse<TripAdvisorLocationDetails>>
    );
  }

  getLocationPhotos(
    locationId: number,
    params?: {
      language?: string;
      limit?: number;
      offset?: number;
      source?: "Expert" | "Management" | "Traveler";
    }
  ): Promise<TripAdvisorPaginatedResponse<TripAdvisorLocationPhoto[]>> {
    return fetch(
      `${this._baseUrl}/location/${locationId}/photos${this._makeQueryParams(
        params
      )}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    ).then(
      (res) =>
        res.json() as Promise<
          TripAdvisorPaginatedResponse<TripAdvisorLocationPhoto[]>
        >
    );
  }
}
