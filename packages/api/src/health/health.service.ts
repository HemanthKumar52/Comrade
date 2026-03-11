import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVaccinationDto, SaveInsuranceDto } from './dto/health.dto';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  getRequiredVaccinations(country: string) {
    const vaccines = COUNTRY_VACCINES[country.toUpperCase()];
    if (!vaccines) {
      return {
        country,
        required: [],
        recommended: ['Routine vaccinations (MMR, DPT, Polio)'],
        notes: 'Check with your doctor for personalized advice.',
      };
    }
    return { country, ...vaccines };
  }

  async logVaccination(userId: string, dto: CreateVaccinationDto) {
    return this.prisma.vaccination.create({
      data: {
        userId,
        name: dto.name,
        date: new Date(dto.date),
        brand: dto.brand || null,
        nextBoosterDue: dto.nextBoosterDue
          ? new Date(dto.nextBoosterDue)
          : null,
        certificate: dto.certificate || null,
      },
    });
  }

  async getMyVaccinations(userId: string) {
    return this.prisma.vaccination.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async saveInsurance(userId: string, dto: SaveInsuranceDto) {
    return this.prisma.travelInsurance.create({
      data: {
        userId,
        policyNumber: dto.policyNumber,
        insurerName: dto.insurerName,
        emergencyHelpline: dto.emergencyHelpline || null,
        coverageStart: new Date(dto.coverageStart),
        coverageEnd: new Date(dto.coverageEnd),
        coverageTypes: dto.coverageTypes || [],
      },
    });
  }

  async getInsurance(userId: string) {
    const insurance = await this.prisma.travelInsurance.findFirst({
      where: { userId },
      orderBy: { coverageEnd: 'desc' },
    });
    if (!insurance) {
      throw new NotFoundException('No insurance record found');
    }
    return insurance;
  }

  async getNearbyPharmacies(lat: number, lng: number, radiusKm: number) {
    const pois = await this.prisma.pOI.findMany({
      where: { category: 'PHARMACY' },
    });

    return pois
      .map((p) => ({
        ...p,
        distanceKm: this.haversineKm(lat, lng, p.latitude, p.longitude),
      }))
      .filter((p) => p.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  getDrugTranslation(name: string, country: string) {
    const key = name.toLowerCase();
    const equivalents = DRUG_MAP[key];
    if (!equivalents) {
      return {
        originalName: name,
        country,
        equivalentName: 'Unknown',
        notes: 'Ask a local pharmacist for assistance.',
      };
    }
    const countryName = equivalents[country.toUpperCase()] || equivalents['DEFAULT'];
    return {
      originalName: name,
      country,
      equivalentName: countryName || name,
      genericName: equivalents['GENERIC'] || name,
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

const COUNTRY_VACCINES: Record<
  string,
  { required: string[]; recommended: string[]; notes: string }
> = {
  KE: {
    required: ['Yellow Fever'],
    recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Malaria prophylaxis', 'Meningitis'],
    notes: 'Yellow fever certificate required for entry. Malaria prophylaxis strongly recommended.',
  },
  IN: {
    required: [],
    recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies'],
    notes: 'No mandatory vaccines but several recommended. Malaria prophylaxis for rural areas.',
  },
  TH: {
    required: [],
    recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Japanese Encephalitis', 'Rabies'],
    notes: 'Yellow fever certificate required if arriving from an endemic area.',
  },
  BR: {
    required: ['Yellow Fever (for certain regions)'],
    recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies'],
    notes: 'Yellow fever vaccination recommended for Amazon and central regions.',
  },
  EG: {
    required: [],
    recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Rabies'],
    notes: 'Yellow fever certificate required if arriving from endemic area.',
  },
  NG: {
    required: ['Yellow Fever'],
    recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Meningitis', 'Malaria prophylaxis'],
    notes: 'Yellow fever certificate mandatory. Malaria prophylaxis essential.',
  },
  JP: {
    required: [],
    recommended: ['Japanese Encephalitis', 'Hepatitis A'],
    notes: 'Japan is generally very safe. Standard routine vaccinations sufficient.',
  },
  US: {
    required: [],
    recommended: ['Routine vaccinations'],
    notes: 'No special vaccinations required for most travelers.',
  },
};

const DRUG_MAP: Record<string, Record<string, string>> = {
  paracetamol: {
    GENERIC: 'Acetaminophen/Paracetamol',
    US: 'Tylenol (Acetaminophen)',
    GB: 'Paracetamol',
    IN: 'Crocin / Dolo',
    JP: 'Calonal',
    DEFAULT: 'Acetaminophen',
  },
  ibuprofen: {
    GENERIC: 'Ibuprofen',
    US: 'Advil / Motrin',
    GB: 'Nurofen',
    IN: 'Brufen',
    JP: 'Eve',
    DEFAULT: 'Ibuprofen',
  },
  aspirin: {
    GENERIC: 'Acetylsalicylic acid',
    US: 'Bayer Aspirin',
    GB: 'Disprin',
    IN: 'Disprin / Ecosprin',
    DEFAULT: 'Aspirin',
  },
  amoxicillin: {
    GENERIC: 'Amoxicillin',
    US: 'Amoxil',
    IN: 'Mox / Novamox',
    DEFAULT: 'Amoxicillin',
  },
  omeprazole: {
    GENERIC: 'Omeprazole',
    US: 'Prilosec',
    IN: 'Omez',
    GB: 'Losec',
    DEFAULT: 'Omeprazole',
  },
  cetirizine: {
    GENERIC: 'Cetirizine',
    US: 'Zyrtec',
    IN: 'Cetzine / Okacet',
    GB: 'Piriteze',
    DEFAULT: 'Cetirizine',
  },
  metformin: {
    GENERIC: 'Metformin',
    US: 'Glucophage',
    IN: 'Glycomet',
    DEFAULT: 'Metformin',
  },
  loperamide: {
    GENERIC: 'Loperamide',
    US: 'Imodium',
    IN: 'Eldoper',
    GB: 'Imodium',
    DEFAULT: 'Loperamide',
  },
};
