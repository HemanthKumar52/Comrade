export enum VerificationTier {
  PHONE = 'phone',
  ID = 'id',
  COMMUNITY = 'community',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  bio: string | null;
  verificationTier: 'phone' | 'id' | 'community';
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelStats {
  totalKm: number;
  placesVisited: number;
  tripsCompleted: number;
  travelStreak: number;
  vehicleBreakdown: Record<string, number>;
}

export interface SocialStats {
  followers: number;
  following: number;
  coTravelers: number;
  partnerConnections: number;
}

export interface UserProfile extends User {
  travelStats: TravelStats;
  badges: string[];
  socialStats: SocialStats;
}
