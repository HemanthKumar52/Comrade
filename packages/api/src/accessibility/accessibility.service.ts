import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetAccessibilityProfileDto } from './dto/accessibility.dto';

@Injectable()
export class AccessibilityService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.accessibilityProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return {
        userId,
        wheelchairUser: false,
        visualImpairment: false,
        hearingImpairment: false,
        seniorMode: false,
        medicalConditions: [],
      };
    }
    return profile;
  }

  async setProfile(userId: string, dto: SetAccessibilityProfileDto) {
    return this.prisma.accessibilityProfile.upsert({
      where: { userId },
      create: {
        userId,
        wheelchairUser: dto.wheelchairUser ?? false,
        visualImpairment: dto.visualImpairment ?? false,
        hearingImpairment: dto.hearingImpairment ?? false,
        seniorMode: dto.seniorMode ?? false,
        medicalConditions: dto.medicalConditions || [],
      },
      update: {
        ...(dto.wheelchairUser !== undefined && {
          wheelchairUser: dto.wheelchairUser,
        }),
        ...(dto.visualImpairment !== undefined && {
          visualImpairment: dto.visualImpairment,
        }),
        ...(dto.hearingImpairment !== undefined && {
          hearingImpairment: dto.hearingImpairment,
        }),
        ...(dto.seniorMode !== undefined && { seniorMode: dto.seniorMode }),
        ...(dto.medicalConditions !== undefined && {
          medicalConditions: dto.medicalConditions,
        }),
      },
    });
  }

  async getAccessiblePOIs(lat: number, lng: number, radiusKm: number) {
    const pois = await this.prisma.pOI.findMany({
      where: { wheelchairAccessible: true },
    });

    return pois
      .map((p) => ({
        ...p,
        distanceKm: this.haversineKm(lat, lng, p.latitude, p.longitude),
      }))
      .filter((p) => p.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async getAccessibleRoute(
    sourceLat: number,
    sourceLng: number,
    destLat: number,
    destLng: number,
  ) {
    // Try OSRM with wheelchair profile, fallback to driving
    const profiles = ['wheelchair', 'driving'];

    for (const profile of profiles) {
      try {
        const url = `https://router.project-osrm.org/route/v1/${profile}/${sourceLng},${sourceLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(url);
        if (!res.ok) continue;

        const data = (await res.json()) as any;
        if (data.code === 'Ok' && data.routes?.length > 0) {
          const route = data.routes[0];
          return {
            profile,
            distanceKm: Math.round((route.distance / 1000) * 100) / 100,
            durationMin: Math.round(route.duration / 60),
            geometry: route.geometry,
            steps: route.legs?.[0]?.steps?.map((s: any) => ({
              instruction: s.maneuver?.instruction || '',
              distance: s.distance,
              duration: s.duration,
            })),
          };
        }
      } catch {
        continue;
      }
    }

    // Fallback: straight-line distance
    const distance = this.haversineKm(sourceLat, sourceLng, destLat, destLng);
    return {
      profile: 'fallback',
      distanceKm: Math.round(distance * 100) / 100,
      durationMin: Math.round((distance / 4) * 60), // ~4 km/h wheelchair speed
      geometry: null,
      steps: [],
      note: 'Route service unavailable. Showing estimated straight-line distance.',
    };
  }

  private haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
