import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async updateMemberLocation(
    tripId: string,
    userId: string,
    lat: number,
    lng: number,
  ) {
    const member = await this.prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });
    if (!member) {
      throw new NotFoundException('Trip member not found');
    }

    return this.prisma.tripMember.update({
      where: { id: member.id },
      data: {
        lastLocation: { lat, lng },
        lastLocationAt: new Date(),
      },
    });
  }

  async saveTrackPoint(
    tripId: string,
    userId: string,
    coords: { lat: number; lng: number; speed?: number; altitude?: number },
  ) {
    // Find or create a route log for this trip
    let routeLog = await this.prisma.routeLog.findFirst({
      where: { tripId },
      orderBy: { createdAt: 'desc' },
    });

    if (!routeLog) {
      routeLog = await this.prisma.routeLog.create({
        data: {
          tripId,
          coordinates: [[coords.lat, coords.lng]],
          speedData: coords.speed ? [coords.speed] : [],
          altitudeData: coords.altitude ? [coords.altitude] : [],
        },
      });
      return routeLog;
    }

    const existingCoords = (routeLog.coordinates as number[][]) || [];
    const existingSpeed = (routeLog.speedData as number[]) || [];
    const existingAltitude = (routeLog.altitudeData as number[]) || [];

    return this.prisma.routeLog.update({
      where: { id: routeLog.id },
      data: {
        coordinates: [...existingCoords, [coords.lat, coords.lng]],
        speedData: coords.speed
          ? [...existingSpeed, coords.speed]
          : existingSpeed,
        altitudeData: coords.altitude
          ? [...existingAltitude, coords.altitude]
          : existingAltitude,
      },
    });
  }

  async checkGeofences(tripId: string, lat: number, lng: number) {
    const geofences = await this.prisma.geofence.findMany({
      where: { tripId },
    });

    const results: Array<{
      geofenceId: string;
      name: string;
      inside: boolean;
      distanceMeters: number;
    }> = [];

    for (const fence of geofences) {
      const distance = this.haversineDistance(
        lat,
        lng,
        fence.latitude,
        fence.longitude,
      );
      results.push({
        geofenceId: fence.id,
        name: fence.name,
        inside: distance <= fence.radiusMeters,
        distanceMeters: Math.round(distance),
      });
    }

    return results;
  }

  async getActiveTripLocations(tripId: string) {
    const members = await this.prisma.tripMember.findMany({
      where: { tripId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return members.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      avatar: m.user.avatar,
      role: m.role,
      lastLocation: m.lastLocation,
      lastLocationAt: m.lastLocationAt,
    }));
  }

  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
