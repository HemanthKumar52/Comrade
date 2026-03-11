import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getNearbyEvents(
    lat: number,
    lng: number,
    radiusKm: number,
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const where: any = {};
    if (dateFrom || dateTo) {
      where.startDate = {};
      if (dateFrom) where.startDate.gte = dateFrom;
      if (dateTo) where.startDate.lte = dateTo;
    }

    const events = await this.prisma.liveEvent.findMany({ where });

    return events
      .filter((e) => e.latitude != null && e.longitude != null)
      .map((e) => ({
        ...e,
        distanceKm: this.haversineKm(lat, lng, e.latitude!, e.longitude!),
      }))
      .filter((e) => e.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async getFestivals(country: string, month?: number) {
    const where: any = { country, type: 'FESTIVAL' };

    const festivals = await this.prisma.liveEvent.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });

    if (month) {
      return festivals.filter(
        (f) => f.startDate.getMonth() + 1 === month,
      );
    }

    return festivals;
  }

  getSunTimes(lat: number, lng: number, date: Date) {
    // Simplified solar position calculation
    const dayOfYear = this.getDayOfYear(date);
    const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
    const latRad = (lat * Math.PI) / 180;
    const declRad = (declination * Math.PI) / 180;

    const hourAngle =
      Math.acos(
        -Math.tan(latRad) * Math.tan(declRad),
      ) *
      (180 / Math.PI);

    const solarNoon = 12 - lng / 15; // approximate
    const sunriseHour = solarNoon - hourAngle / 15;
    const sunsetHour = solarNoon + hourAngle / 15;
    const goldenHourStart = sunsetHour - 1;
    const goldenHourEnd = sunsetHour;

    return {
      date: date.toISOString().split('T')[0],
      latitude: lat,
      longitude: lng,
      sunrise: this.hoursToTimeString(sunriseHour),
      sunset: this.hoursToTimeString(sunsetHour),
      solarNoon: this.hoursToTimeString(solarNoon),
      goldenHour: {
        start: this.hoursToTimeString(goldenHourStart),
        end: this.hoursToTimeString(goldenHourEnd),
      },
      dayLengthHours: Math.round((sunsetHour - sunriseHour) * 100) / 100,
    };
  }

  async getEventById(id: string) {
    const event = await this.prisma.liveEvent.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
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

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private hoursToTimeString(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
}
