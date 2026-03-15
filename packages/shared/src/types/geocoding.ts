export interface GeocodingResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  country: string;
  countryCode: string;
  state?: string;
  city?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    countryCode?: string;
  };
  boundingBox?: [number, number, number, number];
}

export interface ReverseGeocodingResult extends GeocodingResult {
  distance?: number;
}

export interface AirQualityData {
  aqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  co: number;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    name?: string;
  };
}
