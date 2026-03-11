import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const INITIAL_BADGES = [
  // Distance family
  { name: '100km Rookie', description: 'Travel your first 100 kilometers', family: 'DISTANCE', xpValue: 50, tier: 1, unlockCriteria: { type: 'distance', value: 100 } },
  { name: '500km Explorer', description: 'Cover 500 kilometers of journey', family: 'DISTANCE', xpValue: 150, tier: 2, unlockCriteria: { type: 'distance', value: 500 } },
  { name: '1000km Pathfinder', description: 'Blaze through 1000 kilometers', family: 'DISTANCE', xpValue: 300, tier: 3, unlockCriteria: { type: 'distance', value: 1000 } },
  { name: '5000km Legend', description: 'Achieve legendary 5000km milestone', family: 'DISTANCE', xpValue: 1000, tier: 4, unlockCriteria: { type: 'distance', value: 5000 } },
  { name: '10000km Odyssey', description: 'Complete an epic 10000km odyssey', family: 'DISTANCE', xpValue: 2500, tier: 5, unlockCriteria: { type: 'distance', value: 10000 } },

  // Place family
  { name: '5 Cities Starter', description: 'Visit 5 different cities', family: 'PLACE', xpValue: 50, tier: 1, unlockCriteria: { type: 'places', value: 5 } },
  { name: '10 Cities Hopper', description: 'Hop between 10 cities', family: 'PLACE', xpValue: 150, tier: 2, unlockCriteria: { type: 'places', value: 10 } },
  { name: 'Beach Hopper', description: 'Visit 5 beach destinations', family: 'PLACE', xpValue: 100, tier: 2, unlockCriteria: { type: 'beach_places', value: 5 } },
  { name: 'Hill Station Hero', description: 'Conquer 5 hill stations', family: 'PLACE', xpValue: 100, tier: 2, unlockCriteria: { type: 'hill_places', value: 5 } },
  { name: '50 Places Master', description: 'Master 50 unique destinations', family: 'PLACE', xpValue: 500, tier: 4, unlockCriteria: { type: 'places', value: 50 } },

  // Vehicle family
  { name: 'Biker Soul', description: 'Complete 5 trips on a bike', family: 'VEHICLE', xpValue: 100, tier: 1, unlockCriteria: { type: 'vehicle_trips', vehicle: 'BIKE', value: 5 } },
  { name: 'Train Traveler', description: 'Take 5 train journeys', family: 'VEHICLE', xpValue: 100, tier: 1, unlockCriteria: { type: 'vehicle_trips', vehicle: 'TRAIN', value: 5 } },
  { name: 'Sky Nomad', description: 'Fly 5 times', family: 'VEHICLE', xpValue: 150, tier: 2, unlockCriteria: { type: 'vehicle_trips', vehicle: 'FLIGHT', value: 5 } },
  { name: 'Road Tripper', description: 'Complete 10 car trips', family: 'VEHICLE', xpValue: 200, tier: 2, unlockCriteria: { type: 'vehicle_trips', vehicle: 'CAR', value: 10 } },
  { name: 'Multi-Modal Master', description: 'Use 4 different vehicle types', family: 'VEHICLE', xpValue: 300, tier: 3, unlockCriteria: { type: 'vehicle_variety', value: 4 } },

  // Social family
  { name: 'First Partner', description: 'Complete your first trip with a partner', family: 'SOCIAL', xpValue: 50, tier: 1, unlockCriteria: { type: 'partner_trips', value: 1 } },
  { name: 'Squad Leader', description: 'Lead 3 squad trips', family: 'SOCIAL', xpValue: 150, tier: 2, unlockCriteria: { type: 'squad_trips', value: 3 } },
  { name: 'Group Pioneer', description: 'Organize a group trip with 5+ members', family: 'SOCIAL', xpValue: 200, tier: 2, unlockCriteria: { type: 'group_trip_size', value: 5 } },
  { name: '10 Connections', description: 'Travel with 10 different partners', family: 'SOCIAL', xpValue: 250, tier: 3, unlockCriteria: { type: 'unique_partners', value: 10 } },
  { name: 'Community Star', description: 'Receive 20 positive reviews', family: 'SOCIAL', xpValue: 500, tier: 4, unlockCriteria: { type: 'positive_reviews', value: 20 } },

  // Nature family
  { name: 'Midnight Rider', description: 'Start a trip between midnight and 4 AM', family: 'NATURE', xpValue: 75, tier: 1, unlockCriteria: { type: 'midnight_trip', value: 1 } },
  { name: 'Monsoon Maverick', description: 'Complete 3 trips during monsoon season', family: 'NATURE', xpValue: 100, tier: 2, unlockCriteria: { type: 'monsoon_trips', value: 3 } },
  { name: 'Sunrise Chaser', description: 'Start 5 trips before 6 AM', family: 'NATURE', xpValue: 100, tier: 2, unlockCriteria: { type: 'sunrise_trips', value: 5 } },
  { name: 'Weekend Warrior', description: 'Complete 10 weekend trips', family: 'NATURE', xpValue: 200, tier: 3, unlockCriteria: { type: 'weekend_trips', value: 10 } },
  { name: '30 Day Streak', description: 'Maintain a 30-day travel streak', family: 'NATURE', xpValue: 500, tier: 4, unlockCriteria: { type: 'streak', value: 30 } },
];

const LEVEL_THRESHOLDS: Array<{ level: string; minXP: number }> = [
  { level: 'LEGEND', minXP: 10000 },
  { level: 'NAVIGATOR', minXP: 2000 },
  { level: 'VOYAGER', minXP: 500 },
  { level: 'EXPLORER', minXP: 100 },
  { level: 'WANDERER', minXP: 0 },
];

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async getAllBadges(family?: string) {
    const where: any = {};
    if (family) {
      where.family = family;
    }

    return this.prisma.badge.findMany({
      where,
      orderBy: [{ family: 'asc' }, { tier: 'asc' }],
    });
  }

  async getUserBadges(userId: string) {
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
      include: { badge: true },
    });

    return userBadges.map((ub) => ({
      ...ub.badge,
      unlockedAt: ub.unlockedAt,
      tripId: ub.tripId,
    }));
  }

  async getBadgeDetail(id: string) {
    const badge = await this.prisma.badge.findUnique({
      where: { id },
      include: {
        _count: { select: { userBadges: true } },
      },
    });

    if (!badge) {
      throw new NotFoundException('Badge not found');
    }

    return badge;
  }

  async checkAndAwardBadges(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all badges not yet unlocked by this user
    const unlockedBadgeIds = (
      await this.prisma.userBadge.findMany({
        where: { userId },
        select: { badgeId: true },
      })
    ).map((ub) => ub.badgeId);

    const availableBadges = await this.prisma.badge.findMany({
      where: { id: { notIn: unlockedBadgeIds } },
    });

    // Gather user stats for checking criteria
    const completedTrips = await this.prisma.trip.findMany({
      where: { userId, status: 'COMPLETED' },
      include: { members: true },
    });

    const vehicleCounts: Record<string, number> = {};
    for (const trip of completedTrips) {
      if (trip.vehicleType) {
        vehicleCounts[trip.vehicleType] = (vehicleCounts[trip.vehicleType] || 0) + 1;
      }
    }

    const uniquePartners = new Set<string>();
    for (const trip of completedTrips) {
      for (const member of trip.members) {
        if (member.userId !== userId) {
          uniquePartners.add(member.userId);
        }
      }
    }

    const positiveReviews = await this.prisma.review.count({
      where: { toUserId: userId, rating: { gte: 4 } },
    });

    const partnerTrips = completedTrips.filter((t) => t.members.length > 1);
    const squadTrips = completedTrips.filter(
      (t) => t.type === 'SQUAD' && t.userId === userId,
    );
    const largestGroupSize = Math.max(
      0,
      ...completedTrips.map((t) => t.members.length),
    );

    const weekendTrips = completedTrips.filter((t) => {
      if (!t.startedAt) return false;
      const day = t.startedAt.getDay();
      return day === 0 || day === 6;
    });

    const midnightTrips = completedTrips.filter((t) => {
      if (!t.startedAt) return false;
      const hour = t.startedAt.getHours();
      return hour >= 0 && hour < 4;
    });

    const sunriseTrips = completedTrips.filter((t) => {
      if (!t.startedAt) return false;
      return t.startedAt.getHours() < 6;
    });

    const newlyAwarded: string[] = [];

    for (const badge of availableBadges) {
      const criteria = badge.unlockCriteria as any;
      if (!criteria) continue;

      let earned = false;

      switch (criteria.type) {
        case 'distance':
          earned = user.totalKm >= criteria.value;
          break;
        case 'places':
          earned = user.placesVisited >= criteria.value;
          break;
        case 'vehicle_trips':
          earned = (vehicleCounts[criteria.vehicle] || 0) >= criteria.value;
          break;
        case 'vehicle_variety':
          earned = Object.keys(vehicleCounts).length >= criteria.value;
          break;
        case 'partner_trips':
          earned = partnerTrips.length >= criteria.value;
          break;
        case 'squad_trips':
          earned = squadTrips.length >= criteria.value;
          break;
        case 'group_trip_size':
          earned = largestGroupSize >= criteria.value;
          break;
        case 'unique_partners':
          earned = uniquePartners.size >= criteria.value;
          break;
        case 'positive_reviews':
          earned = positiveReviews >= criteria.value;
          break;
        case 'midnight_trip':
          earned = midnightTrips.length >= criteria.value;
          break;
        case 'sunrise_trips':
          earned = sunriseTrips.length >= criteria.value;
          break;
        case 'weekend_trips':
          earned = weekendTrips.length >= criteria.value;
          break;
        case 'streak':
          earned = user.travelStreak >= criteria.value;
          break;
        // beach_places, hill_places, monsoon_trips require additional metadata
        default:
          break;
      }

      if (earned) {
        await this.prisma.userBadge.create({
          data: { userId, badgeId: badge.id },
        });
        newlyAwarded.push(badge.name);
      }
    }

    // Recalculate XP and level
    if (newlyAwarded.length > 0) {
      const totalXP = await this.calculateXP(userId);
      const level = this.getUserLevelFromXP(totalXP);

      await this.prisma.user.update({
        where: { id: userId },
        data: { xp: totalXP, level: level as any },
      });
    }

    return newlyAwarded;
  }

  async calculateXP(userId: string): Promise<number> {
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: { select: { xpValue: true } } },
    });

    return userBadges.reduce((sum, ub) => sum + ub.badge.xpValue, 0);
  }

  getUserLevel(xp: number): string {
    return this.getUserLevelFromXP(xp);
  }

  async getUserLevelForUser(userId: string): Promise<{ level: string; xp: number }> {
    const xp = await this.calculateXP(userId);
    return { level: this.getUserLevelFromXP(xp), xp };
  }

  private getUserLevelFromXP(xp: number): string {
    for (const threshold of LEVEL_THRESHOLDS) {
      if (xp >= threshold.minXP) {
        return threshold.level;
      }
    }
    return 'WANDERER';
  }
}
