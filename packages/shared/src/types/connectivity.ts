import type { GeoPoint } from './map.js';

export interface WifiHotspot {
  id: string;
  name: string;
  location: string;
  coordinates: GeoPoint;
  password: string | null;
  speedRating: number;
  reliabilityRating: number;
  indoor: boolean;
  verified: boolean;
}

export interface SIMOption {
  id: string;
  carrier: string;
  country: string;
  dataGB: number;
  validityDays: number;
  price: number;
  currency: string;
  esim: boolean;
  purchaseUrl: string;
}

export interface OfflineContent {
  type: string;
  region: string;
  sizeBytes: number;
  downloaded: boolean;
  lastUpdated: Date;
}
