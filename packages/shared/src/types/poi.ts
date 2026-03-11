import type { GeoPoint } from './map.js';

export type POICategory =
  | 'tea_shop'
  | 'hotel'
  | 'hostel'
  | 'restaurant'
  | 'historic'
  | 'petrol'
  | 'atm'
  | 'pharmacy'
  | 'scenic'
  | 'trailhead'
  | 'wifi_hotspot'
  | 'hospital'
  | 'embassy'
  | 'religious';

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  description: string;
  coordinates: GeoPoint;
  rating: number;
  totalRatings: number;
  submittedBy: string;
  verified: boolean;
  photos: string[];
  amenities: string[];
  openingHours: string | null;
  priceRange: string | null;
  wheelchairAccessible: boolean;
  dietaryOptions: string[];
}
