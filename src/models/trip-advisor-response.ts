interface TripAdvisorError {
  message: string;
  type: string;
  code: number;
}

export interface TripAdvisorResponse<T> {
  data?: T;
  error?: TripAdvisorError;
}

export interface TripAdvisorPaginatedResponse<T>
  extends TripAdvisorResponse<T> {
  paging: {
    next: string | null;
    previous: string | null;
    results: number;
    total_results: number;
    skipped: number;
  };
}

interface AddressObj {
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  postalcode: string;
  address_string: string;
}

interface Images {
  additionalProp: {
    width: number;
    url: string;
    height: string;
  };
}

interface Source {
  name: string;
  localized_name: string;
}

interface User {
  username: string;
  user_location: {
    name: string;
    id: string;
  };
  review_count: number;
  reviewer_badge: string;
  avatar: {
    additionalProp: string;
  };
}

export interface TripAdvisorLocationSearch {
  location_id: number;
  name: string;
  distance: string;
  bearing: string;
  address_obj: AddressObj;
}

export interface TripAdvisorLocationPhoto {
  id: number;
  is_blessed: boolean;
  album: string;
  caption: string;
  published_date: string;
  images: Images;
  source: Source;
  user: User;
}

export interface TripAdvisorLocationDetails {
  location_id: number;
  name: string;
  description: string;
  web_url: string;
  address_obj: AddressObj;
  ancestors: {
    abbrv: string;
    level: string;
    name: string;
    location_id: number;
  }[];
  latitude: number;
  longitude: number;
  timezone: string;
  email: string;
  phone: string;
  website: string;
  write_review: string;
  ranking_data: {
    geo_location_id: number;
    ranking_string: string;
    geo_location_name: string;
    ranking_out_of: number;
    ranking: number;
  };
  rating: number;
  rating_image_url: string;
  num_reviews: string;
  review_rating_count: {
    additionalProps: string;
  };
  subratings: {
    additionalProps: {
      name: string;
      localized_name: string;
      rating_image_url: string;
      value: number;
    };
  };
  photo_count: number;
  see_all_photos: string;
  price_level: string;
  hours: {
    periods: {
      open: {
        day: number;
        time: string;
      };
      close: {
        day: number;
        time: string;
      };
    }[];
    weekday_text: string[];
  };
  amenities: string[];
  features: string[];
  cuisine: {
    name: string;
    localized_name: string;
  }[];
  parent_brand: string;
  brand: string;
  category: {
    name: string;
    localized_name: string;
  };
  subcategory: { name: string; localized_name: string }[];
  groups: {
    name: string;
    localized_name: string;
    categories: {
      name: string;
      localized_name: string;
    }[];
  }[];
  styles: string[];
  neighborhood_info: { location_id: number; name: string }[];
  trip_types: {
    name: string;
    localized_name: string;
    value: string;
  }[];
  awards: {
    award_type: string;
    year: number;
    images: {
      tiny: string;
      small: string;
      large: string;
    };
    categories: string[];
    display_name: string;
  }[];
}
