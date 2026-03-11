import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        bio: true,
        bannerImage: true,
        verificationTier: true,
        level: true,
        xp: true,
        totalKm: true,
        placesVisited: true,
        tripsCompleted: true,
        travelStreak: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [badgeCount, tripCount] = await Promise.all([
      this.prisma.userBadge.count({ where: { userId } }),
      this.prisma.trip.count({ where: { userId } }),
    ]);

    return {
      ...user,
      stats: {
        totalKm: user.totalKm,
        placesVisited: user.placesVisited,
        tripsCompleted: user.tripsCompleted,
        travelStreak: user.travelStreak,
        badgesUnlocked: badgeCount,
        totalTrips: tripCount,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.bannerImage !== undefined && { bannerImage: dto.bannerImage }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        bio: true,
        bannerImage: true,
        level: true,
        xp: true,
        updatedAt: true,
      },
    });
  }

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        xp: true,
        totalKm: true,
        placesVisited: true,
        tripsCompleted: true,
        travelStreak: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [recentTrips, latestBadges, badgeCount] = await Promise.all([
      this.prisma.trip.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          source: true,
          destination: true,
          status: true,
          vehicleType: true,
          distanceKm: true,
          startedAt: true,
          endedAt: true,
          createdAt: true,
        },
      }),
      this.prisma.userBadge.findMany({
        where: { userId },
        orderBy: { unlockedAt: 'desc' },
        take: 6,
        include: {
          badge: {
            select: {
              id: true,
              name: true,
              description: true,
              family: true,
              iconUrl: true,
              xpValue: true,
            },
          },
        },
      }),
      this.prisma.userBadge.count({ where: { userId } }),
    ]);

    return {
      user,
      stats: {
        totalKm: user.totalKm,
        placesVisited: user.placesVisited,
        tripsCompleted: user.tripsCompleted,
        travelStreak: user.travelStreak,
        badgesUnlocked: badgeCount,
      },
      recentTrips,
      latestBadges: latestBadges.map((ub) => ({
        ...ub.badge,
        unlockedAt: ub.unlockedAt,
      })),
    };
  }

  async getUserPublic(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        bannerImage: true,
        verificationTier: true,
        level: true,
        xp: true,
        totalKm: true,
        placesVisited: true,
        tripsCompleted: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserStats(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        totalKm: true,
        placesVisited: true,
        tripsCompleted: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const trips = await this.prisma.trip.findMany({
      where: { userId: id, status: 'COMPLETED' },
      select: { vehicleType: true, distanceKm: true },
    });

    const vehicleBreakdown: Record<string, { count: number; totalKm: number }> = {};
    for (const trip of trips) {
      const key = trip.vehicleType || 'UNKNOWN';
      if (!vehicleBreakdown[key]) {
        vehicleBreakdown[key] = { count: 0, totalKm: 0 };
      }
      vehicleBreakdown[key].count += 1;
      vehicleBreakdown[key].totalKm += trip.distanceKm || 0;
    }

    return {
      totalKm: user.totalKm,
      placesVisited: user.placesVisited,
      tripsCompleted: user.tripsCompleted,
      vehicleBreakdown,
    };
  }

  async getUserBadges(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId: id },
      orderBy: { unlockedAt: 'desc' },
      include: {
        badge: true,
      },
    });

    return userBadges.map((ub) => ({
      ...ub.badge,
      unlockedAt: ub.unlockedAt,
    }));
  }
}
