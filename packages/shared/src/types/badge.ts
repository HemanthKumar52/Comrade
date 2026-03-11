export type BadgeFamily = 'distance' | 'place' | 'vehicle' | 'social' | 'nature';

export type UserLevel = 'wanderer' | 'explorer' | 'voyager' | 'navigator' | 'legend';

export interface Badge {
  id: string;
  name: string;
  description: string;
  family: BadgeFamily;
  animationUrl: string;
  iconUrl: string;
  xpValue: number;
  unlockCriteria: string;
  tier: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: Date;
  tripId: string | null;
}

// XP_THRESHOLDS constant is exported from constants/index.ts
