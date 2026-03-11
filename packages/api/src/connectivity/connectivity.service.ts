import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitWifiDto } from './dto/connectivity.dto';

@Injectable()
export class ConnectivityService {
  constructor(private prisma: PrismaService) {}

  async getNearbyWifi(lat: number, lng: number, radiusKm: number) {
    const hotspots = await this.prisma.wifiHotspot.findMany();

    return hotspots
      .map((h) => ({
        ...h,
        distanceKm: this.haversineKm(lat, lng, h.latitude, h.longitude),
      }))
      .filter((h) => h.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async submitWifi(userId: string, dto: SubmitWifiDto) {
    return this.prisma.wifiHotspot.create({
      data: {
        name: dto.name,
        location: dto.location || null,
        latitude: dto.lat,
        longitude: dto.lng,
        password: dto.password || null,
        indoor: dto.indoor || false,
        submittedById: userId,
      },
    });
  }

  async getSIMOptions(country: string) {
    return this.prisma.sIMOption.findMany({
      where: { country },
      orderBy: { price: 'asc' },
    });
  }

  async getOfflineContent(region: string) {
    return this.prisma.offlineContent.findMany({
      where: { region },
      orderBy: { type: 'asc' },
    });
  }

  getVPNGuide(country: string) {
    const info = VPN_GUIDE[country.toUpperCase()];
    if (!info) {
      return {
        country,
        vpnLegal: true,
        notes: 'VPN usage is generally unrestricted in this country.',
        blockedServices: [],
      };
    }
    return { country, ...info };
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

const VPN_GUIDE: Record<
  string,
  { vpnLegal: boolean; notes: string; blockedServices: string[] }
> = {
  CN: {
    vpnLegal: false,
    notes:
      'VPNs are restricted in China. Only government-approved VPNs are legal. Many popular VPN services are blocked.',
    blockedServices: ['Google', 'Facebook', 'WhatsApp', 'Instagram', 'Twitter', 'YouTube'],
  },
  RU: {
    vpnLegal: false,
    notes:
      'Russia has banned many VPN services. Using non-approved VPNs can result in fines.',
    blockedServices: ['LinkedIn', 'select social media'],
  },
  IR: {
    vpnLegal: false,
    notes: 'VPNs are illegal in Iran though widely used. Government monitors internet traffic.',
    blockedServices: ['Facebook', 'Twitter', 'YouTube', 'Telegram'],
  },
  AE: {
    vpnLegal: true,
    notes:
      'VPN usage is legal but using it for illegal activities is punishable. VoIP services may be restricted.',
    blockedServices: ['VoIP services (Skype calls, FaceTime)'],
  },
  TR: {
    vpnLegal: true,
    notes: 'VPNs are legal but some VPN websites may be blocked. Wikipedia was blocked until 2020.',
    blockedServices: ['Occasional social media blocks during unrest'],
  },
  KP: {
    vpnLegal: false,
    notes: 'Internet access is extremely restricted in North Korea. Foreign visitors have no internet access.',
    blockedServices: ['All foreign services'],
  },
  IN: {
    vpnLegal: true,
    notes: 'VPNs are legal in India. Some free VPNs may be slow.',
    blockedServices: [],
  },
  US: {
    vpnLegal: true,
    notes: 'VPN usage is fully legal and unrestricted.',
    blockedServices: [],
  },
  GB: {
    vpnLegal: true,
    notes: 'VPN usage is fully legal and unrestricted.',
    blockedServices: [],
  },
};
