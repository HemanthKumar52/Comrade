export interface DiscoveredPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  distance?: number;
  description?: string;
  tags: string[];
  isHiddenGem: boolean;
  isFree: boolean;
  rating?: number;
  openingHours?: string;
  website?: string;
  address?: string;
}

export type PlaceCategory =
  | 'tourism'
  | 'museum'
  | 'artwork'
  | 'viewpoint'
  | 'beach'
  | 'park'
  | 'castle'
  | 'ruins'
  | 'marketplace'
  | 'temple'
  | 'church'
  | 'mosque'
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'nightclub'
  | 'theatre'
  | 'zoo'
  | 'aquarium'
  | 'theme_park';

export interface PlacesSearchParams {
  lat: number;
  lng: number;
  radius: number;
  category?: PlaceCategory;
  limit?: number;
}
