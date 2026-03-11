import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async search(
    currentUserId: string,
    filters: {
      destination?: string;
      dateFrom?: string;
      dateTo?: string;
      vehicleType?: string;
      tripType?: string;
      language?: string;
    },
    take = 20,
    skip = 0,
  ) {
    // Search users who have upcoming/planning trips matching criteria
    const tripWhere: any = {
      status: 'PLANNING',
      userId: { not: currentUserId },
    };

    if (filters.destination) {
      tripWhere.destination = {
        contains: filters.destination,
        mode: 'insensitive',
      };
    }
    if (filters.vehicleType) {
      tripWhere.vehicleType = filters.vehicleType;
    }
    if (filters.tripType) {
      tripWhere.type = filters.tripType;
    }
    if (filters.dateFrom || filters.dateTo) {
      tripWhere.createdAt = {};
      if (filters.dateFrom) {
        tripWhere.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        tripWhere.createdAt.lte = new Date(filters.dateTo);
      }
    }

    const [trips, total] = await Promise.all([
      this.prisma.trip.findMany({
        where: tripWhere,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
              level: true,
              xp: true,
              totalKm: true,
              tripsCompleted: true,
              verificationTier: true,
            },
          },
        },
      }),
      this.prisma.trip.count({ where: tripWhere }),
    ]);

    // Group by user, return unique partner results
    const userMap = new Map<string, any>();
    for (const trip of trips) {
      if (!userMap.has(trip.userId)) {
        userMap.set(trip.userId, {
          user: trip.user,
          trips: [],
        });
      }
      userMap.get(trip.userId).trips.push({
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        type: trip.type,
        vehicleType: trip.vehicleType,
        status: trip.status,
        createdAt: trip.createdAt,
      });
    }

    const data = Array.from(userMap.values());

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
    };
  }

  async sendRequest(fromUserId: string, dto: CreateRequestDto) {
    if (fromUserId === dto.toUserId) {
      throw new BadRequestException('Cannot send request to yourself');
    }

    const toUser = await this.prisma.user.findUnique({
      where: { id: dto.toUserId },
    });
    if (!toUser) {
      throw new NotFoundException('User not found');
    }

    // Check for existing pending request
    const existing = await this.prisma.partnerRequest.findFirst({
      where: {
        fromUserId,
        toUserId: dto.toUserId,
        status: 'PENDING',
      },
    });
    if (existing) {
      throw new BadRequestException('A pending request already exists for this user');
    }

    return this.prisma.partnerRequest.create({
      data: {
        fromUserId,
        toUserId: dto.toUserId,
        tripId: dto.tripId || undefined,
        message: dto.message,
      },
      include: {
        toUser: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async listRequests(
    userId: string,
    type?: string,
    status?: string,
  ) {
    const where: any = {};

    if (type === 'sent') {
      where.fromUserId = userId;
    } else if (type === 'received') {
      where.toUserId = userId;
    } else {
      where.OR = [{ fromUserId: userId }, { toUserId: userId }];
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.partnerRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        fromUser: {
          select: { id: true, name: true, avatar: true, level: true },
        },
        toUser: {
          select: { id: true, name: true, avatar: true, level: true },
        },
        trip: {
          select: { id: true, title: true, destination: true },
        },
      },
    });
  }

  async updateRequest(
    requestId: string,
    userId: string,
    action: string,
  ) {
    const request = await this.prisma.partnerRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Only the receiver can accept/decline
    if (request.toUserId !== userId) {
      throw new ForbiddenException('Only the receiver can respond to this request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('This request has already been processed');
    }

    const newStatus = action === 'accept' ? 'ACCEPTED' : 'DECLINED';

    const updated = await this.prisma.partnerRequest.update({
      where: { id: requestId },
      data: { status: newStatus as any },
      include: {
        fromUser: {
          select: { id: true, name: true, avatar: true },
        },
        toUser: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // If accepted and trip exists, add the requester as a trip member
    if (newStatus === 'ACCEPTED' && request.tripId) {
      const existingMember = await this.prisma.tripMember.findUnique({
        where: {
          tripId_userId: { tripId: request.tripId, userId: request.fromUserId },
        },
      });

      if (!existingMember) {
        await this.prisma.tripMember.create({
          data: {
            tripId: request.tripId,
            userId: request.fromUserId,
            role: 'MEMBER',
          },
        });
      }
    }

    return updated;
  }

  async getPartnerProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
        travelStreak: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [badges, reviews, reviewStats] = await Promise.all([
      this.prisma.userBadge.findMany({
        where: { userId },
        orderBy: { unlockedAt: 'desc' },
        take: 10,
        include: {
          badge: {
            select: { id: true, name: true, family: true, iconUrl: true },
          },
        },
      }),
      this.prisma.review.findMany({
        where: { toUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          fromUser: {
            select: { id: true, name: true, avatar: true },
          },
          trip: {
            select: { id: true, title: true, destination: true },
          },
        },
      }),
      this.prisma.review.aggregate({
        where: { toUserId: userId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      ...user,
      badges: badges.map((ub) => ({ ...ub.badge, unlockedAt: ub.unlockedAt })),
      reviews,
      reviewStats: {
        avgRating: reviewStats._avg.rating || 0,
        totalReviews: reviewStats._count.rating,
      },
    };
  }

  async createReview(
    fromUserId: string,
    toUserId: string,
    dto: CreateReviewDto,
  ) {
    if (fromUserId === toUserId) {
      throw new BadRequestException('Cannot review yourself');
    }

    const toUser = await this.prisma.user.findUnique({
      where: { id: toUserId },
    });
    if (!toUser) {
      throw new NotFoundException('User not found');
    }

    // Verify the trip exists and both users were part of it
    const trip = await this.prisma.trip.findUnique({
      where: { id: dto.tripId },
      include: { members: true },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const memberIds = trip.members.map((m) => m.userId);
    const isFromMember = memberIds.includes(fromUserId) || trip.userId === fromUserId;
    const isToMember = memberIds.includes(toUserId) || trip.userId === toUserId;

    if (!isFromMember || !isToMember) {
      throw new BadRequestException('Both users must be members of the trip');
    }

    return this.prisma.review.create({
      data: {
        fromUserId,
        toUserId,
        tripId: dto.tripId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        fromUser: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }
}
