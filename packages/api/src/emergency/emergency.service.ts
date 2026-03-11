import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TriggerSOSDto,
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
} from './dto/emergency.dto';

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  // ── SOS ──────────────────────────────────────────────────────

  async triggerSOS(userId: string, dto: TriggerSOSDto) {
    const alert = await this.prisma.sOSAlert.create({
      data: {
        userId,
        latitude: dto.lat,
        longitude: dto.lng,
        nearestAddress: dto.nearestAddress || null,
        status: 'active',
      },
    });

    // Fetch emergency contacts for potential notification
    const contacts = await this.prisma.emergencyContact.findMany({
      where: { userId },
    });

    return { alert, notifiedContacts: contacts.length };
  }

  // ── Emergency Contacts ───────────────────────────────────────

  async getContacts(userId: string) {
    return this.prisma.emergencyContact.findMany({
      where: { userId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async addContact(userId: string, dto: CreateEmergencyContactDto) {
    return this.prisma.emergencyContact.create({
      data: {
        userId,
        name: dto.name,
        phone: dto.phone,
        relationship: dto.relationship,
        isPrimary: dto.isPrimary || false,
      },
    });
  }

  async updateContact(id: string, userId: string, dto: UpdateEmergencyContactDto) {
    const contact = await this.prisma.emergencyContact.findFirst({
      where: { id, userId },
    });
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.relationship !== undefined && { relationship: dto.relationship }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
      },
    });
  }

  async deleteContact(id: string, userId: string) {
    const contact = await this.prisma.emergencyContact.findFirst({
      where: { id, userId },
    });
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    await this.prisma.emergencyContact.delete({ where: { id } });
    return { success: true };
  }

  // ── Embassies ────────────────────────────────────────────────

  async getEmbassies(country: string, homeCountry: string) {
    return this.prisma.embassy.findMany({
      where: { country, homeCountry },
    });
  }

  // ── Advisories ───────────────────────────────────────────────

  async getAdvisories(country: string) {
    const advisory = await this.prisma.travelAdvisory.findUnique({
      where: { country },
    });
    if (!advisory) {
      return { country, level: 'UNKNOWN', description: 'No advisory data available' };
    }
    return advisory;
  }

  // ── Hospitals / Medical ──────────────────────────────────────

  async getNearbyHospitals(lat: number, lng: number, radiusKm: number) {
    const facilities = await this.prisma.medicalFacility.findMany();

    return facilities
      .map((f) => ({
        ...f,
        distanceKm: this.haversineKm(lat, lng, f.latitude, f.longitude),
      }))
      .filter((f) => f.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // ── Emergency Numbers ────────────────────────────────────────

  getEmergencyNumbers(country: string) {
    const numbers = EMERGENCY_NUMBERS[country.toUpperCase()];
    if (!numbers) {
      return {
        country,
        police: 'Unknown',
        ambulance: 'Unknown',
        fire: 'Unknown',
        note: 'Emergency numbers not available for this country',
      };
    }
    return { country, ...numbers };
  }

  // ── Helpers ──────────────────────────────────────────────────

  private haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}

const EMERGENCY_NUMBERS: Record<
  string,
  { police: string; ambulance: string; fire: string }
> = {
  IN: { police: '100', ambulance: '102', fire: '101' },
  US: { police: '911', ambulance: '911', fire: '911' },
  GB: { police: '999', ambulance: '999', fire: '999' },
  AU: { police: '000', ambulance: '000', fire: '000' },
  JP: { police: '110', ambulance: '119', fire: '119' },
  FR: { police: '17', ambulance: '15', fire: '18' },
  DE: { police: '110', ambulance: '112', fire: '112' },
  IT: { police: '113', ambulance: '118', fire: '115' },
  ES: { police: '091', ambulance: '061', fire: '080' },
  CN: { police: '110', ambulance: '120', fire: '119' },
  KR: { police: '112', ambulance: '119', fire: '119' },
  TH: { police: '191', ambulance: '1669', fire: '199' },
  SG: { police: '999', ambulance: '995', fire: '995' },
  MY: { police: '999', ambulance: '999', fire: '994' },
  ID: { police: '110', ambulance: '118', fire: '113' },
  BR: { police: '190', ambulance: '192', fire: '193' },
  MX: { police: '911', ambulance: '911', fire: '911' },
  AE: { police: '999', ambulance: '998', fire: '997' },
  SA: { police: '999', ambulance: '997', fire: '998' },
  EG: { police: '122', ambulance: '123', fire: '180' },
  ZA: { police: '10111', ambulance: '10177', fire: '10177' },
  KE: { police: '999', ambulance: '999', fire: '999' },
  NZ: { police: '111', ambulance: '111', fire: '111' },
  CA: { police: '911', ambulance: '911', fire: '911' },
  RU: { police: '102', ambulance: '103', fire: '101' },
  TR: { police: '155', ambulance: '112', fire: '110' },
  VN: { police: '113', ambulance: '115', fire: '114' },
  PH: { police: '117', ambulance: '911', fire: '911' },
  NP: { police: '100', ambulance: '102', fire: '101' },
  LK: { police: '119', ambulance: '110', fire: '111' },
};
