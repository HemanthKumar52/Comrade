import type { UserLevel, BadgeFamily } from '../types/badge.js';
import type { POICategory } from '../types/poi.js';
import type { VehicleType, TravelerType } from '../types/trip.js';
import type { MapTheme } from '../types/map.js';

export const XP_THRESHOLDS: Record<UserLevel, number> = {
  wanderer: 0,
  explorer: 500,
  voyager: 2000,
  navigator: 5000,
  legend: 15000,
} as const;

export const BADGE_FAMILIES: BadgeFamily[] = [
  'distance',
  'place',
  'vehicle',
  'social',
  'nature',
] as const;

export const POI_CATEGORIES: POICategory[] = [
  'tea_shop',
  'hotel',
  'hostel',
  'restaurant',
  'historic',
  'petrol',
  'atm',
  'pharmacy',
  'scenic',
  'trailhead',
  'wifi_hotspot',
  'hospital',
  'embassy',
  'religious',
] as const;

export const VEHICLE_TYPES: VehicleType[] = [
  'car',
  'bike',
  'bus',
  'train',
  'flight',
  'trek',
  'bicycle',
  'auto',
] as const;

export const TRAVELER_TYPES: TravelerType[] = [
  'solo',
  'duo',
  'squad',
  'group',
] as const;

export const BRAND_COLORS = {
  primary: '#1A3C5E',
  accent: '#E8733A',
} as const;

export const MAP_THEMES: MapTheme[] = [
  'dark_voyage',
  'daylight',
  'terrain',
  'satellite',
] as const;

export const DEFAULT_RATE_LIMITS = {
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  requestsPerDay: 10000,
} as const;
