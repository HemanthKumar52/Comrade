import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStampDto } from './dto/passport-stamps.dto';

@Injectable()
export class PassportStampsService {
  constructor(private prisma: PrismaService) {}

  async getMyStamps(userId: string) {
    return this.prisma.tripPassportStamp.findMany({
      where: { userId },
      orderBy: { stampedAt: 'desc' },
    });
  }

  async addStamp(userId: string, dto: CreateStampDto) {
    return this.prisma.tripPassportStamp.upsert({
      where: {
        userId_destination: { userId, destination: dto.destination },
      },
      create: {
        userId,
        destination: dto.destination,
        country: dto.country || null,
        artworkUrl: dto.artworkUrl || null,
      },
      update: {
        artworkUrl: dto.artworkUrl || undefined,
        stampedAt: new Date(),
      },
    });
  }

  async getUserStamps(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.tripPassportStamp.findMany({
      where: { userId },
      orderBy: { stampedAt: 'desc' },
    });
  }

  async autoGenerateStamp(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.status !== 'COMPLETED') {
      throw new NotFoundException('Trip must be completed to generate stamp');
    }

    return this.prisma.tripPassportStamp.upsert({
      where: {
        userId_destination: { userId, destination: trip.destination },
      },
      create: {
        userId,
        destination: trip.destination,
        country: null, // Could parse from destination
        tripId,
      },
      update: {
        tripId,
        stampedAt: new Date(),
      },
    });
  }
}
