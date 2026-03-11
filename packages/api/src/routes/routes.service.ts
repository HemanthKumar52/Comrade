import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const OSRM_URL = process.env.OSRM_URL || 'https://router.project-osrm.org';

interface RouteCoords {
  lat: number;
  lng: number;
}

interface CalculateRouteDto {
  sourceCoords: RouteCoords;
  destCoords: RouteCoords;
  profile: 'driving' | 'walking' | 'cycling';
}

interface RouteLogDto {
  coordinates: Array<{ lat: number; lng: number }>;
  distanceKm: number;
  vehicleType?: string;
}

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  async calculateRoute(dto: CalculateRouteDto) {
    const { sourceCoords, destCoords, profile } = dto;

    if (!sourceCoords || !destCoords) {
      throw new BadRequestException('Source and destination coordinates are required');
    }

    const osrmProfile = this.mapProfile(profile);
    const url =
      `${OSRM_URL}/route/v1/${osrmProfile}/` +
      `${sourceCoords.lng},${sourceCoords.lat};${destCoords.lng},${destCoords.lat}` +
      `?overview=full&geometries=geojson&steps=true`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as any;

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new BadRequestException('No route found between the given coordinates');
      }

      const route = data.routes[0];

      return {
        geometry: route.geometry,
        distance: route.distance, // meters
        distanceKm: Math.round((route.distance / 1000) * 100) / 100,
        duration: route.duration, // seconds
        durationMin: Math.round(route.duration / 60),
        steps: route.legs?.[0]?.steps?.map((step: any) => ({
          instruction: step.maneuver?.instruction || '',
          name: step.name || '',
          distance: step.distance,
          duration: step.duration,
          maneuver: step.maneuver,
        })) || [],
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        `Failed to calculate route: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getAlternativeRoutes(
    sourceLat: number,
    sourceLng: number,
    destLat: number,
    destLng: number,
  ) {
    const url =
      `${OSRM_URL}/route/v1/driving/` +
      `${sourceLng},${sourceLat};${destLng},${destLat}` +
      `?overview=full&geometries=geojson&alternatives=5`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as any;

      if (data.code !== 'Ok' || !data.routes) {
        throw new BadRequestException('No routes found');
      }

      return data.routes.map((route: any, index: number) => ({
        index,
        geometry: route.geometry,
        distance: route.distance,
        distanceKm: Math.round((route.distance / 1000) * 100) / 100,
        duration: route.duration,
        durationMin: Math.round(route.duration / 60),
      }));
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        `Failed to fetch alternative routes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async saveRouteLog(tripId: string, userId: string, dto: RouteLogDto) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Verify user is a member of the trip
    const member = await this.prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });
    if (!member && trip.userId !== userId) {
      throw new BadRequestException('You are not a member of this trip');
    }

    const routeLog = await this.prisma.routeLog.create({
      data: {
        tripId,
        coordinates: dto.coordinates,
        distanceKm: dto.distanceKm,
        vehicleType: (dto.vehicleType as any) || undefined,
      },
    });

    // Update trip distance if route has distance
    if (dto.distanceKm) {
      await this.prisma.trip.update({
        where: { id: tripId },
        data: {
          distanceKm: { increment: dto.distanceKm },
        },
      });
    }

    return routeLog;
  }

  private mapProfile(profile: string): string {
    switch (profile) {
      case 'walking':
        return 'foot';
      case 'cycling':
        return 'bike';
      case 'driving':
      default:
        return 'car';
    }
  }
}
