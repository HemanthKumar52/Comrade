export type MapTheme = 'dark_voyage' | 'daylight' | 'terrain' | 'satellite';

export type MapViewMode = '2d' | '3d';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoLineString {
  coordinates: [number, number][];
}

export interface RouteInfo {
  distance: number;
  duration: number;
  geometry: GeoLineString;
  steps: RouteStep[];
  alternativeRoutes: AlternativeRoute[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinates: GeoPoint;
}

export interface AlternativeRoute {
  distance: number;
  duration: number;
  geometry: GeoLineString;
}

export interface POILayer {
  type: string;
  visible: boolean;
  data: unknown[];
}
