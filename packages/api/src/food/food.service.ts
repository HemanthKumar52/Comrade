import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetDietaryProfileDto } from './dto/dietary-profile.dto';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  async getDishes(country: string, region?: string) {
    const where: any = { country };
    if (region) {
      where.region = region;
    }

    return this.prisma.localDish.findMany({
      where,
      orderBy: { mustTryScore: 'desc' },
    });
  }

  getWaterSafety(country: string) {
    const info = WATER_SAFETY[country.toUpperCase()];
    if (!info) {
      return {
        country,
        safety: 'UNKNOWN',
        recommendation: 'Check local sources for water safety information',
      };
    }
    return { country, ...info };
  }

  async getDietaryProfile(userId: string) {
    const profile = await this.prisma.dietaryProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return {
        userId,
        vegetarian: false,
        vegan: false,
        halal: false,
        kosher: false,
        glutenFree: false,
        dairyFree: false,
        nutAllergy: false,
        shellfishAllergy: false,
      };
    }
    return profile;
  }

  async setDietaryProfile(userId: string, dto: SetDietaryProfileDto) {
    return this.prisma.dietaryProfile.upsert({
      where: { userId },
      create: {
        userId,
        vegetarian: dto.vegetarian ?? false,
        vegan: dto.vegan ?? false,
        halal: dto.halal ?? false,
        kosher: dto.kosher ?? false,
        glutenFree: dto.glutenFree ?? false,
        dairyFree: dto.dairyFree ?? false,
        nutAllergy: dto.nutAllergy ?? false,
        shellfishAllergy: dto.shellfishAllergy ?? false,
      },
      update: {
        ...(dto.vegetarian !== undefined && { vegetarian: dto.vegetarian }),
        ...(dto.vegan !== undefined && { vegan: dto.vegan }),
        ...(dto.halal !== undefined && { halal: dto.halal }),
        ...(dto.kosher !== undefined && { kosher: dto.kosher }),
        ...(dto.glutenFree !== undefined && { glutenFree: dto.glutenFree }),
        ...(dto.dairyFree !== undefined && { dairyFree: dto.dairyFree }),
        ...(dto.nutAllergy !== undefined && { nutAllergy: dto.nutAllergy }),
        ...(dto.shellfishAllergy !== undefined && {
          shellfishAllergy: dto.shellfishAllergy,
        }),
      },
    });
  }

  async getRestaurants(lat: number, lng: number, radiusKm: number, dietary?: string) {
    const pois = await this.prisma.pOI.findMany({
      where: { category: 'RESTAURANT' },
    });

    let filtered = pois
      .map((p) => ({
        ...p,
        distanceKm: this.haversineKm(lat, lng, p.latitude, p.longitude),
      }))
      .filter((p) => p.distanceKm <= radiusKm);

    if (dietary) {
      filtered = filtered.filter((p) =>
        p.dietaryOptions.some(
          (d) => d.toLowerCase() === dietary.toLowerCase(),
        ),
      );
    }

    return filtered.sort((a, b) => a.distanceKm - b.distanceKm);
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

const WATER_SAFETY: Record<
  string,
  { safety: string; recommendation: string }
> = {
  US: { safety: 'SAFE', recommendation: 'Tap water is generally safe to drink' },
  GB: { safety: 'SAFE', recommendation: 'Tap water is safe to drink' },
  JP: { safety: 'SAFE', recommendation: 'Tap water is safe to drink' },
  AU: { safety: 'SAFE', recommendation: 'Tap water is safe to drink' },
  CA: { safety: 'SAFE', recommendation: 'Tap water is safe to drink' },
  DE: { safety: 'SAFE', recommendation: 'Tap water is safe to drink' },
  FR: { safety: 'SAFE', recommendation: 'Tap water is safe to drink' },
  SG: { safety: 'SAFE', recommendation: 'Tap water is safe to drink' },
  IN: { safety: 'BOTTLED_ONLY', recommendation: 'Drink only bottled or purified water' },
  TH: { safety: 'BOTTLED_ONLY', recommendation: 'Drink only bottled water' },
  VN: { safety: 'BOTTLED_ONLY', recommendation: 'Drink only bottled water' },
  ID: { safety: 'BOTTLED_ONLY', recommendation: 'Drink only bottled water' },
  PH: { safety: 'BOTTLED_ONLY', recommendation: 'Drink only bottled water' },
  EG: { safety: 'BOTTLED_ONLY', recommendation: 'Drink only bottled water' },
  MX: { safety: 'BOIL', recommendation: 'Boil or buy bottled water' },
  CN: { safety: 'BOIL', recommendation: 'Boil tap water before drinking' },
  NP: { safety: 'BOTTLED_ONLY', recommendation: 'Drink only bottled or purified water' },
  KE: { safety: 'BOIL', recommendation: 'Boil or use purification tablets' },
  BR: { safety: 'BOIL', recommendation: 'Boil or buy bottled in rural areas' },
  RU: { safety: 'BOIL', recommendation: 'Boil tap water or drink bottled' },
};
