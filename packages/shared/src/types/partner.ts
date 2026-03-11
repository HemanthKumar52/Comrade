import type { TravelStats } from './user.js';
import type { TravelerType, VehicleType } from './trip.js';

export interface PartnerRequest {
  id: string;
  fromUser: string;
  toUser: string;
  tripId: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  message: string | null;
  createdAt: Date;
}

export interface PartnerProfile {
  userId: string;
  travelStats: TravelStats;
  sharedBadges: string[];
  pastTrips: string[];
  mutualConnections: string[];
  reviews: Review[];
  rating: number;
}

export interface PartnerSearchFilters {
  destination: string | null;
  dateRange: { start: Date; end: Date } | null;
  vehicleType: VehicleType | null;
  tripType: TravelerType | null;
  genderPreference: string | null;
  language: string | null;
  interests: string[];
}

export interface Review {
  id: string;
  fromUser: string;
  toUser: string;
  tripId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
