import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

const CARBON_FACTORS: Record<string, number> = {
  CAR: 0.21,
  BIKE: 0.1,
  BUS: 0.089,
  TRAIN: 0.041,
  FLIGHT: 0.255,
  TREK: 0,
  BICYCLE: 0,
  AUTO: 0.15,
};

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTripDto) {
    const trip = await this.prisma.trip.create({
      data: {
        userId,
        title: dto.title,
        type: dto.type,
        source: dto.source,
        destination: dto.destination,
        sourceCoords: dto.sourceCoords || undefined,
        destCoords: dto.destCoords || undefined,
        vehicleType: dto.vehicleType || undefined,
        routeMode: dto.routeMode || undefined,
      },
    });

    // Auto-add creator as LEAD member
    await this.prisma.tripMember.create({
      data: {
        tripId: trip.id,
        userId,
        role: 'LEAD',
      },
    });

    return trip;
  }

  async findAll(
    userId: string,
    status?: string,
    take = 20,
    skip = 0,
  ) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.trip.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
          _count: { select: { routeLogs: true, notes: true } },
        },
      }),
      this.prisma.trip.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
    };
  }

  async findOne(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        routeLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { notes: true, routeLogs: true } },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async update(id: string, userId: string, dto: UpdateTripDto) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.userId !== userId) {
      throw new ForbiddenException('Only the trip owner can update this trip');
    }

    return this.prisma.trip.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.source !== undefined && { source: dto.source }),
        ...(dto.destination !== undefined && { destination: dto.destination }),
        ...(dto.sourceCoords !== undefined && { sourceCoords: dto.sourceCoords }),
        ...(dto.destCoords !== undefined && { destCoords: dto.destCoords }),
        ...(dto.vehicleType !== undefined && { vehicleType: dto.vehicleType }),
        ...(dto.routeMode !== undefined && { routeMode: dto.routeMode }),
      },
    });
  }

  async softDelete(id: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.userId !== userId) {
      throw new ForbiddenException('Only the trip owner can cancel this trip');
    }

    return this.prisma.trip.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async startTrip(id: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.userId !== userId) {
      throw new ForbiddenException('Only the trip owner can start this trip');
    }
    if (trip.status !== 'PLANNING') {
      throw new BadRequestException('Trip can only be started from PLANNING status');
    }

    return this.prisma.trip.update({
      where: { id },
      data: { status: 'ACTIVE', startedAt: new Date() },
    });
  }

  async endTrip(id: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.userId !== userId) {
      throw new ForbiddenException('Only the trip owner can end this trip');
    }
    if (trip.status !== 'ACTIVE') {
      throw new BadRequestException('Trip can only be ended from ACTIVE status');
    }

    const carbonFootprint = this.calculateCarbonFootprint(
      trip.vehicleType,
      trip.distanceKm,
    );

    const updatedTrip = await this.prisma.trip.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
        carbonFootprint,
      },
    });

    // Update user stats
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tripsCompleted: { increment: 1 },
        totalKm: { increment: trip.distanceKm || 0 },
      },
    });

    return updatedTrip;
  }

  async addMember(tripId: string, userId: string, memberId: string, role: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.userId !== userId) {
      throw new ForbiddenException('Only the trip owner can add members');
    }

    const existing = await this.prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId, userId: memberId } },
    });
    if (existing) {
      throw new BadRequestException('User is already a member of this trip');
    }

    return this.prisma.tripMember.create({
      data: {
        tripId,
        userId: memberId,
        role: (role as any) || 'MEMBER',
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async removeMember(tripId: string, userId: string, memberId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.userId !== userId) {
      throw new ForbiddenException('Only the trip owner can remove members');
    }

    const member = await this.prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId, userId: memberId } },
    });
    if (!member) {
      throw new NotFoundException('Member not found in this trip');
    }

    return this.prisma.tripMember.delete({
      where: { tripId_userId: { tripId, userId: memberId } },
    });
  }

  async getTripStats(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        members: true,
        routeLogs: true,
        _count: { select: { notes: true, expenses: true } },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const totalRouteDistance = trip.routeLogs.reduce(
      (sum, log) => sum + (log.distanceKm || 0),
      0,
    );

    return {
      tripId: trip.id,
      title: trip.title,
      status: trip.status,
      distanceKm: trip.distanceKm || totalRouteDistance,
      durationMin: trip.durationMin,
      carbonFootprint: trip.carbonFootprint || this.calculateCarbonFootprint(
        trip.vehicleType,
        trip.distanceKm || totalRouteDistance,
      ),
      memberCount: trip.members.length,
      routeLogCount: trip.routeLogs.length,
      noteCount: trip._count.notes,
      expenseCount: trip._count.expenses,
    };
  }

  private calculateCarbonFootprint(
    vehicleType: string | null,
    distanceKm: number | null,
  ): number {
    if (!vehicleType || !distanceKm) return 0;
    const factor = CARBON_FACTORS[vehicleType] ?? 0.15;
    return Math.round(factor * distanceKm * 100) / 100;
  }
}
