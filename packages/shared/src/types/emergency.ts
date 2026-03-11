import type { GeoPoint } from './map.js';

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  location: GeoPoint;
  nearestAddress: string;
  timestamp: Date;
  status: string;
}

export interface Embassy {
  id: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  coordinates: GeoPoint;
}

export type TravelAdvisoryLevel = 'safe' | 'caution' | 'avoid_non_essential' | 'do_not_travel';

export interface TravelAdvisory {
  country: string;
  level: TravelAdvisoryLevel;
  description: string;
  updatedAt: Date;
}

export interface MedicalFacility {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  coordinates: GeoPoint;
  is24Hour: boolean;
  englishSpeaking: boolean;
  insuranceAccepted: string[];
}
