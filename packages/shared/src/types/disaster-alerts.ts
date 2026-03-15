export interface DisasterAlert {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  severity: 'green' | 'orange' | 'red';
  magnitude?: number;
  location: {
    lat: number;
    lng: number;
    name: string;
    country?: string;
  };
  timestamp: string;
  source: string;
  url?: string;
  affectsTrip?: boolean;
}

export type DisasterType = 'earthquake' | 'cyclone' | 'flood' | 'volcano' | 'drought' | 'tsunami' | 'wildfire';

export interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  lat: number;
  lng: number;
  depth: number;
  tsunami: boolean;
  url: string;
}
