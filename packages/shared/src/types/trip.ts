import type { GeoPoint } from './map.js';

export type TravelerType = 'solo' | 'duo' | 'squad' | 'group';

export type TripStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';

export type VehicleType = 'car' | 'bike' | 'bus' | 'train' | 'flight' | 'trek' | 'bicycle' | 'auto';

export interface Trip {
  id: string;
  userId: string;
  type: TravelerType;
  title: string;
  source: string;
  destination: string;
  sourceCoords: GeoPoint;
  destCoords: GeoPoint;
  status: TripStatus;
  startedAt: Date | null;
  endedAt: Date | null;
  routeMode: string;
  vehicleType: VehicleType;
  distanceKm: number;
  durationMin: number;
  carbonFootprint: number;
}

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: 'lead' | 'member';
  joinedAt: Date;
  liveLocation: GeoPoint | null;
}

export interface RouteLog {
  id: string;
  tripId: string;
  coordinates: [number, number][];
  distanceKm: number;
  vehicleType: VehicleType;
  createdAt: Date;
}
