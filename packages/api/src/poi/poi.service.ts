import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePoiDto } from './dto/create-poi.dto';
import { RatePoiDto } from './dto/rate-poi.dto';

@Injectable()
export class PoiService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    filters: {
      category?: string;
      lat?: number;
      lng?: number;
      radius?: number; // km
      verified?: string;
      search?: string;
    },
    take = 20,
    skip = 0,
  ) {
    // If nearby search with coordinates, use Haversine formula via raw SQL
    if (filters.lat && filters.lng && filters.radius) {
      return this.findNearby(
        filters.lat,
        filters.lng,
        filters.radius,
        filters.category,
        filters.verified,
        filters.search,
        take,
        skip,
      );
    }

    const where: any = {};
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.verified !== undefined) {
      where.verified = filters.verified === 'true';
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.pOI.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.pOI.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, limit: take };
  }

  private async findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    category?: string,
    verified?: string,
    search?: string,
    take = 20,
    skip = 0,
  ) {
    // Haversine formula in raw SQL for PostgreSQL
    const categoryFilter = category ? `AND "category" = '${category}'` : '';
    const verifiedFilter =
      verified !== undefined ? `AND "verified" = ${verified === 'true'}` : '';
    const searchFilter = search
      ? `AND (LOWER("name") LIKE LOWER('%${search}%') OR LOWER("description") LIKE LOWER('%${search}%'))`
      : '';

    const query = `
      SELECT *,
        (6371 * acos(
          cos(radians(${lat})) * cos(radians("latitude")) *
          cos(radians("longitude") - radians(${lng})) +
          sin(radians(${lat})) * sin(radians("latitude"))
        )) AS distance_km
      FROM "POI"
      WHERE (6371 * acos(
        cos(radians(${lat})) * cos(radians("latitude")) *
        cos(radians("longitude") - radians(${lng})) +
        sin(radians(${lat})) * sin(radians("latitude"))
      )) <= ${radiusKm}
      ${categoryFilter}
      ${verifiedFilter}
      ${searchFilter}
      ORDER BY distance_km ASC
      LIMIT ${take} OFFSET ${skip}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM "POI"
      WHERE (6371 * acos(
        cos(radians(${lat})) * cos(radians("latitude")) *
        cos(radians("longitude") - radians(${lng})) +
        sin(radians(${lat})) * sin(radians("latitude"))
      )) <= ${radiusKm}
      ${categoryFilter}
      ${verifiedFilter}
      ${searchFilter}
    `;

    const [data, countResult] = await Promise.all([
      this.prisma.$queryRawUnsafe(query),
      this.prisma.$queryRawUnsafe<Array<{ total: number }>>(countQuery),
    ]);

    const total = Array.isArray(countResult) ? (countResult[0] as any)?.total || 0 : 0;

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
    };
  }

  async findOne(id: string) {
    const poi = await this.prisma.pOI.findUnique({
      where: { id },
      include: {
        ratings: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        submittedBy: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!poi) {
      throw new NotFoundException('POI not found');
    }

    return poi;
  }

  async create(userId: string, dto: CreatePoiDto) {
    return this.prisma.pOI.create({
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        latitude: dto.latitude,
        longitude: dto.longitude,
        photos: dto.photos || undefined,
        amenities: dto.amenities || [],
        openingHours: dto.openingHours || undefined,
        priceRange: dto.priceRange,
        wheelchairAccessible: dto.wheelchairAccessible || false,
        dietaryOptions: dto.dietaryOptions || [],
        address: dto.address,
        city: dto.city,
        country: dto.country,
        submittedById: userId,
      },
    });
  }

  async update(id: string, userId: string, userRole: string, dto: Partial<CreatePoiDto>) {
    const poi = await this.prisma.pOI.findUnique({ where: { id } });
    if (!poi) {
      throw new NotFoundException('POI not found');
    }
    if (poi.submittedById !== userId && userRole !== 'admin') {
      throw new ForbiddenException('Only the submitter or an admin can update this POI');
    }

    return this.prisma.pOI.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.photos !== undefined && { photos: dto.photos }),
        ...(dto.amenities !== undefined && { amenities: dto.amenities }),
        ...(dto.openingHours !== undefined && { openingHours: dto.openingHours }),
        ...(dto.priceRange !== undefined && { priceRange: dto.priceRange }),
        ...(dto.wheelchairAccessible !== undefined && {
          wheelchairAccessible: dto.wheelchairAccessible,
        }),
        ...(dto.dietaryOptions !== undefined && { dietaryOptions: dto.dietaryOptions }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.country !== undefined && { country: dto.country }),
      },
    });
  }

  async rate(poiId: string, userId: string, dto: RatePoiDto) {
    const poi = await this.prisma.pOI.findUnique({ where: { id: poiId } });
    if (!poi) {
      throw new NotFoundException('POI not found');
    }

    // Upsert rating (one rating per user per POI)
    const existingRating = await this.prisma.pOIRating.findUnique({
      where: { poiId_userId: { poiId, userId } },
    });

    let rating;
    if (existingRating) {
      rating = await this.prisma.pOIRating.update({
        where: { id: existingRating.id },
        data: { rating: dto.rating, comment: dto.comment },
      });
    } else {
      rating = await this.prisma.pOIRating.create({
        data: {
          poiId,
          userId,
          rating: dto.rating,
          comment: dto.comment,
        },
      });
    }

    // Recalculate average rating
    const agg = await this.prisma.pOIRating.aggregate({
      where: { poiId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.pOI.update({
      where: { id: poiId },
      data: {
        rating: agg._avg.rating || 0,
        totalRatings: agg._count.rating,
      },
    });

    return rating;
  }

  async getCategories() {
    return [
      'TEA_SHOP',
      'HOTEL',
      'HOSTEL',
      'RESTAURANT',
      'HISTORIC',
      'PETROL',
      'ATM',
      'PHARMACY',
      'SCENIC',
      'TRAILHEAD',
      'WIFI_HOTSPOT',
      'HOSPITAL',
      'EMBASSY',
      'RELIGIOUS',
    ];
  }
}
