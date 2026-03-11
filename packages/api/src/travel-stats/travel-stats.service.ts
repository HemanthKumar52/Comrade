import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TravelStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, xp: true, level: true, totalKm: true, placesVisited: true, tripsCompleted: true },
    });

    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const tripStats = await this.prisma.trip.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { distanceKm: true },
    });

    const vehicleTypes = await this.prisma.trip.findMany({
      where: { userId, vehicleType: { not: null } },
      select: { vehicleType: true },
      distinct: ['vehicleType'],
    });

    const stampCount = await this.prisma.tripPassportStamp.count({
      where: { userId },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        xp: user.xp,
        level: user.level,
      },
      trips: {
        total: tripStats._count.id,
        totalDistanceKm: Math.round((tripStats._sum.distanceKm || 0) * 100) / 100,
        vehicleTypesUsed: vehicleTypes.map((v) => v.vehicleType),
      },
      passportStamps: stampCount,
    };
  }

  async getHeatmap(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: { userId },
      select: { id: true },
    });

    const tripIds = trips.map((t) => t.id);

    if (tripIds.length === 0) {
      return { userId, points: [] };
    }

    const routeLogs = await this.prisma.routeLog.findMany({
      where: { tripId: { in: tripIds } },
      select: { coordinates: true },
    });

    const points: { lat: number; lng: number; intensity: number }[] = [];

    for (const log of routeLogs) {
      const coords = log.coordinates as any[];
      if (Array.isArray(coords)) {
        for (const coord of coords) {
          if (Array.isArray(coord) && coord.length >= 2) {
            points.push({
              lat: coord[0],
              lng: coord[1],
              intensity: 1,
            });
          } else if (coord && typeof coord === 'object' && 'lat' in coord && 'lng' in coord) {
            points.push({
              lat: coord.lat,
              lng: coord.lng,
              intensity: 1,
            });
          }
        }
      }
    }

    return { userId, totalPoints: points.length, points };
  }

  async getTimeline(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        source: true,
        destination: true,
        status: true,
        vehicleType: true,
        distanceKm: true,
        startedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const badges = await this.prisma.userBadge.findMany({
      where: { userId },
      select: {
        id: true,
        unlockedAt: true,
        badge: {
          select: { name: true, description: true, icon: true, tier: true },
        },
      },
      orderBy: { unlockedAt: 'desc' },
    });

    const timeline: any[] = [];

    for (const trip of trips) {
      timeline.push({
        type: 'trip',
        date: trip.startedAt || trip.createdAt,
        data: {
          id: trip.id,
          title: trip.title,
          source: trip.source,
          destination: trip.destination,
          status: trip.status,
          vehicleType: trip.vehicleType,
          distanceKm: trip.distanceKm,
        },
      });
    }

    for (const ub of badges) {
      timeline.push({
        type: 'badge',
        date: ub.unlockedAt,
        data: {
          id: ub.id,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          tier: ub.badge.tier,
        },
      });
    }

    timeline.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return { userId, total: timeline.length, timeline };
  }

  async getWrapped(userId: string, year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const trips = await this.prisma.trip.findMany({
      where: {
        userId,
        createdAt: { gte: startDate, lt: endDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (trips.length === 0) {
      return {
        userId,
        year,
        message: `No trips found for ${year}.`,
        stats: null,
      };
    }

    const totalKm = trips.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
    const totalTrips = trips.length;

    // Most used vehicle type
    const vehicleCounts: Record<string, number> = {};
    for (const trip of trips) {
      if (trip.vehicleType) {
        vehicleCounts[trip.vehicleType] =
          (vehicleCounts[trip.vehicleType] || 0) + 1;
      }
    }
    const mostUsedVehicle =
      Object.entries(vehicleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      'Unknown';

    // Longest trip
    const longestTrip = trips.reduce(
      (max, t) => ((t.distanceKm || 0) > (max.distanceKm || 0) ? t : max),
      trips[0],
    );

    const firstTrip = trips[0];
    const lastTrip = trips[trips.length - 1];

    // Unique destinations
    const destinations = new Set(trips.map((t) => t.destination));

    // Fun comparisons
    const comparisons: string[] = [];
    const roundedKm = Math.round(totalKm);
    if (roundedKm > 40075) {
      comparisons.push(
        `You traveled ${roundedKm.toLocaleString()} km - that's more than the Earth's circumference (40,075 km)!`,
      );
    } else if (roundedKm > 384400) {
      comparisons.push(
        `You traveled ${roundedKm.toLocaleString()} km - almost to the Moon!`,
      );
    } else if (roundedKm > 1000) {
      comparisons.push(
        `You traveled ${roundedKm.toLocaleString()} km - that's like driving from Delhi to Goa ${Math.round(roundedKm / 600)} times!`,
      );
    } else {
      comparisons.push(
        `You traveled ${roundedKm.toLocaleString()} km this year!`,
      );
    }

    if (totalTrips >= 12) {
      comparisons.push(
        `${totalTrips} trips! That's at least one adventure every month.`,
      );
    } else if (totalTrips >= 4) {
      comparisons.push(
        `${totalTrips} trips - you averaged one trip every ${Math.round(12 / totalTrips)} months!`,
      );
    }

    if (destinations.size > 5) {
      comparisons.push(
        `You explored ${destinations.size} unique destinations!`,
      );
    }

    return {
      userId,
      year,
      stats: {
        totalTrips,
        totalKm: Math.round(totalKm * 100) / 100,
        uniqueDestinations: destinations.size,
        mostUsedVehicle,
        longestTrip: {
          id: longestTrip.id,
          title: longestTrip.title,
          destination: longestTrip.destination,
          distanceKm: longestTrip.distanceKm,
        },
        firstTrip: {
          id: firstTrip.id,
          title: firstTrip.title,
          destination: firstTrip.destination,
          date: firstTrip.createdAt,
        },
        lastTrip: {
          id: lastTrip.id,
          title: lastTrip.title,
          destination: lastTrip.destination,
          date: lastTrip.createdAt,
        },
        comparisons,
      },
    };
  }
}
