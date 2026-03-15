import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface USGSFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    title: string;
    status: string;
    tsunami: number;
    sig: number;
    alert: string | null;
    type: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number]; // [lng, lat, depth]
  };
}

interface GDACSEvent {
  eventid: string;
  eventtype: string;
  alertlevel: string;
  severity: { value: number; unit: string };
  country: string;
  fromdate: string;
  todate: string;
  name: string;
  description: string;
  geo_lat: number;
  geo_lng: number;
}

@Injectable()
export class DisasterAlertsService {
  private readonly logger = new Logger(DisasterAlertsService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  private readonly USGS_FEED_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';
  private readonly USGS_QUERY_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
  private readonly GDACS_URL = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP';

  constructor(private readonly prisma: PrismaService) {}

  // ── Earthquakes ────────────────────────────────────────────

  async getEarthquakes(days: number, minMagnitude: number) {
    // Use the pre-built feeds for common queries, or the query API for custom
    const cacheKey = `earthquakes:${days}:${minMagnitude}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    try {
      let url: string;

      // USGS provides pre-built feeds for common thresholds
      if (days <= 7 && minMagnitude >= 4.5) {
        url = `${this.USGS_FEED_URL}/4.5_week.geojson`;
      } else if (days <= 1 && minMagnitude >= 2.5) {
        url = `${this.USGS_FEED_URL}/2.5_day.geojson`;
      } else if (days <= 7 && minMagnitude >= 2.5) {
        url = `${this.USGS_FEED_URL}/2.5_week.geojson`;
      } else {
        // Use the query API for custom date ranges
        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        url = `${this.USGS_QUERY_URL}?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=${minMagnitude}&orderby=time&limit=100`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        this.logger.error(`USGS API error: ${response.status} ${response.statusText}`);
        return { earthquakes: [], total: 0, source: 'usgs', error: 'USGS API temporarily unavailable' };
      }

      const json = await response.json();
      const features: USGSFeature[] = json.features || [];

      // Filter by minMagnitude (feeds may include lower magnitudes)
      const filtered = features.filter((f) => f.properties.mag >= minMagnitude);

      const earthquakes = filtered.map((f) => this.mapUSGSFeature(f));

      const result = {
        earthquakes,
        total: earthquakes.length,
        source: 'usgs',
        period: `${days} days`,
        minMagnitude,
        cached: false,
      };

      this.setCache(cacheKey, { ...result, cached: true });
      return result;
    } catch (error) {
      this.logger.error(`USGS API request failed: ${error}`);
      return {
        earthquakes: [],
        total: 0,
        source: 'usgs',
        error: 'Failed to fetch earthquake data',
      };
    }
  }

  // ── Disasters Near Location ────────────────────────────────

  async getDisastersNear(lat: number, lng: number, radiusKm: number) {
    const cacheKey = `near:${lat}:${lng}:${radiusKm}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    try {
      // Fetch both earthquakes and GDACS events
      const [earthquakeData, gdacsData] = await Promise.all([
        this.fetchRecentEarthquakes(),
        this.fetchGDACSEvents(),
      ]);

      // Filter earthquakes by distance
      const nearbyEarthquakes = earthquakeData
        .map((eq) => ({
          ...eq,
          distanceKm: this.haversineKm(lat, lng, eq.lat, eq.lng),
        }))
        .filter((eq) => eq.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      // Filter GDACS events by distance
      const nearbyGdacs = gdacsData
        .map((ev) => ({
          ...ev,
          distanceKm: this.haversineKm(lat, lng, ev.lat, ev.lng),
        }))
        .filter((ev) => ev.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      const result = {
        location: { lat, lng },
        radiusKm,
        earthquakes: nearbyEarthquakes,
        disasters: nearbyGdacs,
        totalAlerts: nearbyEarthquakes.length + nearbyGdacs.length,
        riskLevel: this.calculateRiskLevel(nearbyEarthquakes, nearbyGdacs),
        cached: false,
      };

      this.setCache(cacheKey, { ...result, cached: true });
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch nearby disasters: ${error}`);
      return {
        location: { lat, lng },
        radiusKm,
        earthquakes: [],
        disasters: [],
        totalAlerts: 0,
        riskLevel: 'unknown',
        error: 'Failed to fetch disaster data',
      };
    }
  }

  // ── Alerts by Country ──────────────────────────────────────

  async getAlertsByCountry(countryCode: string) {
    const cacheKey = `country:${countryCode.toUpperCase()}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    try {
      const [earthquakeData, gdacsData] = await Promise.all([
        this.fetchRecentEarthquakes(),
        this.fetchGDACSEvents(),
      ]);

      const upperCode = countryCode.toUpperCase();

      // Filter GDACS events by country code
      const countryDisasters = gdacsData.filter(
        (ev) => ev.country && ev.country.toUpperCase().includes(upperCode),
      );

      // Filter earthquakes whose place string contains the country name/code
      const countryName = COUNTRY_NAMES[upperCode] || upperCode;
      const countryEarthquakes = earthquakeData.filter(
        (eq) =>
          eq.place &&
          (eq.place.toLowerCase().includes(countryName.toLowerCase()) ||
           eq.place.toLowerCase().includes(upperCode.toLowerCase())),
      );

      const result = {
        countryCode: upperCode,
        countryName,
        earthquakes: countryEarthquakes,
        disasters: countryDisasters,
        totalAlerts: countryEarthquakes.length + countryDisasters.length,
        cached: false,
      };

      this.setCache(cacheKey, { ...result, cached: true });
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch alerts for country ${countryCode}: ${error}`);
      return {
        countryCode: countryCode.toUpperCase(),
        earthquakes: [],
        disasters: [],
        totalAlerts: 0,
        error: 'Failed to fetch disaster data',
      };
    }
  }

  // ── Active Alerts ──────────────────────────────────────────

  async getActiveAlerts() {
    const cacheKey = 'active-alerts';
    const cached = this.getCached(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    try {
      const [earthquakeData, gdacsData] = await Promise.all([
        this.fetchRecentEarthquakes(),
        this.fetchGDACSEvents(),
      ]);

      // Only include significant earthquakes (magnitude >= 5)
      const significantQuakes = earthquakeData.filter((eq) => eq.magnitude >= 5);

      const result = {
        earthquakes: significantQuakes,
        disasters: gdacsData,
        totalAlerts: significantQuakes.length + gdacsData.length,
        lastUpdated: new Date().toISOString(),
        cached: false,
      };

      this.setCache(cacheKey, { ...result, cached: true });
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch active alerts: ${error}`);
      return {
        earthquakes: [],
        disasters: [],
        totalAlerts: 0,
        lastUpdated: new Date().toISOString(),
        error: 'Failed to fetch disaster data',
      };
    }
  }

  // ── Safety Check for Trip ──────────────────────────────────

  async safetyCheckForTrip(tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        waypoints: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const checkRadiusKm = 200; // Check within 200km of each waypoint
    const waypointResults = [];

    for (const waypoint of trip.waypoints) {
      const lat = (waypoint as any).latitude || (waypoint as any).lat;
      const lng = (waypoint as any).longitude || (waypoint as any).lng;

      if (lat && lng) {
        const nearbyAlerts = await this.getDisastersNear(lat, lng, checkRadiusKm);
        waypointResults.push({
          waypoint: {
            id: waypoint.id,
            name: (waypoint as any).name || (waypoint as any).label || 'Waypoint',
            lat,
            lng,
          },
          alertCount: nearbyAlerts.totalAlerts,
          riskLevel: nearbyAlerts.riskLevel,
          earthquakes: nearbyAlerts.earthquakes.slice(0, 5),
          disasters: nearbyAlerts.disasters.slice(0, 5),
        });
      }
    }

    const overallRisk = this.calculateOverallTripRisk(waypointResults);

    return {
      tripId,
      tripName: trip.name,
      checkRadiusKm,
      overallRisk,
      waypointAlerts: waypointResults,
      recommendation: this.getRiskRecommendation(overallRisk),
      checkedAt: new Date().toISOString(),
    };
  }

  // ── Private: Fetch Data ────────────────────────────────────

  private async fetchRecentEarthquakes(): Promise<Array<{
    id: string;
    magnitude: number;
    place: string;
    time: string;
    lat: number;
    lng: number;
    depth: number;
    url: string;
    tsunami: boolean;
    alert: string | null;
  }>> {
    const cacheKey = 'raw-earthquakes';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.USGS_FEED_URL}/4.5_week.geojson`;
      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(`USGS feed error: ${response.status}`);
        return [];
      }

      const json = await response.json();
      const features: USGSFeature[] = json.features || [];
      const mapped = features.map((f) => this.mapUSGSFeature(f));

      this.setCache(cacheKey, mapped);
      return mapped;
    } catch (error) {
      this.logger.error(`Failed to fetch USGS feed: ${error}`);
      return [];
    }
  }

  private async fetchGDACSEvents(): Promise<Array<{
    id: string;
    type: string;
    alertLevel: string;
    severity: string;
    country: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    fromDate: string;
    toDate: string;
  }>> {
    const cacheKey = 'raw-gdacs';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.GDACS_URL}?eventtype=EQ,TC,FL,VO,DR&alertlevel=Green,Orange,Red&limit=50`;
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        this.logger.error(`GDACS API error: ${response.status}`);
        return [];
      }

      const json = await response.json();
      const events: GDACSEvent[] = json.features || json.events || json || [];

      if (!Array.isArray(events)) {
        this.logger.warn('GDACS returned unexpected format');
        return [];
      }

      const mapped = events.map((ev) => ({
        id: ev.eventid || String(Math.random()),
        type: this.mapEventType(ev.eventtype),
        alertLevel: ev.alertlevel || 'unknown',
        severity: ev.severity ? `${ev.severity.value} ${ev.severity.unit}` : 'unknown',
        country: ev.country || 'unknown',
        name: ev.name || 'Unnamed event',
        description: ev.description || '',
        lat: ev.geo_lat || 0,
        lng: ev.geo_lng || 0,
        fromDate: ev.fromdate || '',
        toDate: ev.todate || '',
      }));

      this.setCache(cacheKey, mapped);
      return mapped;
    } catch (error) {
      this.logger.error(`Failed to fetch GDACS events: ${error}`);
      return [];
    }
  }

  // ── Private: Mappers ───────────────────────────────────────

  private mapUSGSFeature(f: USGSFeature) {
    const [lng, lat, depth] = f.geometry.coordinates;
    return {
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place,
      time: new Date(f.properties.time).toISOString(),
      lat,
      lng,
      depth,
      url: f.properties.url,
      tsunami: f.properties.tsunami === 1,
      alert: f.properties.alert,
      significance: f.properties.sig,
      title: f.properties.title,
    };
  }

  private mapEventType(type: string): string {
    const mapping: Record<string, string> = {
      EQ: 'earthquake',
      TC: 'tropical_cyclone',
      FL: 'flood',
      VO: 'volcano',
      DR: 'drought',
    };
    return mapping[type] || type || 'unknown';
  }

  // ── Private: Risk Calculation ──────────────────────────────

  private calculateRiskLevel(
    earthquakes: Array<{ magnitude?: number; distanceKm?: number }>,
    disasters: Array<{ alertLevel?: string; distanceKm?: number }>,
  ): string {
    if (earthquakes.length === 0 && disasters.length === 0) return 'low';

    const hasHighMagnitude = earthquakes.some((eq) => (eq.magnitude || 0) >= 6);
    const hasCloseQuake = earthquakes.some((eq) => (eq.distanceKm || Infinity) < 100);
    const hasRedAlert = disasters.some((d) => d.alertLevel === 'Red');
    const hasOrangeAlert = disasters.some((d) => d.alertLevel === 'Orange');

    if (hasRedAlert || (hasHighMagnitude && hasCloseQuake)) return 'critical';
    if (hasOrangeAlert || hasHighMagnitude || hasCloseQuake) return 'high';
    if (earthquakes.length > 0 || disasters.length > 0) return 'moderate';
    return 'low';
  }

  private calculateOverallTripRisk(
    waypointResults: Array<{ riskLevel: string }>,
  ): string {
    const levels = waypointResults.map((w) => w.riskLevel);
    if (levels.includes('critical')) return 'critical';
    if (levels.includes('high')) return 'high';
    if (levels.includes('moderate')) return 'moderate';
    return 'low';
  }

  private getRiskRecommendation(riskLevel: string): string {
    switch (riskLevel) {
      case 'critical':
        return 'URGENT: Active severe disaster alerts near your trip destinations. Consider postponing or rerouting your trip. Check local emergency services.';
      case 'high':
        return 'WARNING: Significant seismic or disaster activity near your destinations. Monitor the situation closely and have contingency plans ready.';
      case 'moderate':
        return 'NOTICE: Some seismic or weather activity detected near your destinations. Stay informed and follow local news.';
      case 'low':
        return 'Your trip destinations currently show no significant disaster alerts. Conditions look safe.';
      default:
        return 'Unable to determine risk level. Please check local news and emergency services for your destinations.';
    }
  }

  // ── Private: Haversine ─────────────────────────────────────

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

  // ── Private: Cache ─────────────────────────────────────────

  private getCached(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

// ── Country name lookup ──────────────────────────────────────
const COUNTRY_NAMES: Record<string, string> = {
  AF: 'Afghanistan', AL: 'Albania', DZ: 'Algeria', AR: 'Argentina',
  AU: 'Australia', AT: 'Austria', BD: 'Bangladesh', BE: 'Belgium',
  BR: 'Brazil', CA: 'Canada', CL: 'Chile', CN: 'China',
  CO: 'Colombia', CR: 'Costa Rica', HR: 'Croatia', CU: 'Cuba',
  CZ: 'Czech Republic', DK: 'Denmark', EC: 'Ecuador', EG: 'Egypt',
  FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece',
  GT: 'Guatemala', HT: 'Haiti', HN: 'Honduras', HU: 'Hungary',
  IS: 'Iceland', IN: 'India', ID: 'Indonesia', IR: 'Iran',
  IQ: 'Iraq', IE: 'Ireland', IL: 'Israel', IT: 'Italy',
  JP: 'Japan', KE: 'Kenya', KR: 'South Korea', MX: 'Mexico',
  MA: 'Morocco', MM: 'Myanmar', NP: 'Nepal', NL: 'Netherlands',
  NZ: 'New Zealand', NG: 'Nigeria', NO: 'Norway', PK: 'Pakistan',
  PA: 'Panama', PE: 'Peru', PH: 'Philippines', PL: 'Poland',
  PT: 'Portugal', RO: 'Romania', RU: 'Russia', SA: 'Saudi Arabia',
  SG: 'Singapore', ZA: 'South Africa', ES: 'Spain', LK: 'Sri Lanka',
  SE: 'Sweden', CH: 'Switzerland', TW: 'Taiwan', TH: 'Thailand',
  TR: 'Turkey', AE: 'United Arab Emirates', GB: 'United Kingdom',
  US: 'United States', VN: 'Vietnam',
};
