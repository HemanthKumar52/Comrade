import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CulturalService {
  constructor(private prisma: PrismaService) {}

  async getCultureCard(country: string) {
    const card = await this.prisma.cultureCard.findUnique({
      where: { country },
    });
    if (!card) {
      throw new NotFoundException(
        `No culture card found for country: ${country}`,
      );
    }
    return card;
  }

  async getEtiquette(siteType: string, country?: string) {
    const where: any = { siteType };
    if (country) {
      where.country = country;
    }

    const results = await this.prisma.religiousSiteEtiquette.findMany({
      where,
    });

    if (results.length === 0) {
      throw new NotFoundException(
        `No etiquette found for site type: ${siteType}`,
      );
    }

    return results;
  }

  async getPhrases(country: string, limit = 10) {
    // Map country to primary language code
    const langCode = COUNTRY_LANGUAGE_MAP[country.toUpperCase()] || 'en';

    return this.prisma.phrase.findMany({
      where: { langCode },
      take: limit,
      orderBy: { category: 'asc' },
    });
  }
}

const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  JP: 'ja',
  CN: 'zh',
  KR: 'ko',
  TH: 'th',
  VN: 'vi',
  IN: 'hi',
  FR: 'fr',
  DE: 'de',
  ES: 'es',
  IT: 'it',
  PT: 'pt',
  BR: 'pt',
  RU: 'ru',
  AR: 'ar',
  SA: 'ar',
  EG: 'ar',
  TR: 'tr',
  ID: 'id',
  MY: 'ms',
  PH: 'tl',
  NP: 'ne',
  LK: 'si',
  BD: 'bn',
  PK: 'ur',
  IR: 'fa',
  GR: 'el',
  NL: 'nl',
  PL: 'pl',
  SE: 'sv',
  NO: 'no',
  DK: 'da',
  FI: 'fi',
  HU: 'hu',
  CZ: 'cs',
  RO: 'ro',
  UA: 'uk',
  IL: 'he',
};
