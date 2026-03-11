import type { GeoPoint } from './map.js';

export type EventType =
  | 'festival'
  | 'concert'
  | 'sports'
  | 'fair'
  | 'religious'
  | 'workshop'
  | 'local_experience';

export interface LiveEvent {
  id: string;
  name: string;
  type: EventType;
  description: string;
  location: string;
  coordinates: GeoPoint;
  startDate: Date;
  endDate: Date;
  ticketUrl: string | null;
  photo: string | null;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  goldenHourStart: Date;
  goldenHourEnd: Date;
  location: GeoPoint;
  date: Date;
}
