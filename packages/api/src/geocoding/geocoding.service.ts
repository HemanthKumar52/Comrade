import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PartnerApp/1.0';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MS = 1000; // 1 request per second

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

interface GeocodingResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  country: string;
  countryCode: string;
  state: string;
  address: Record<string, string>;
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly cache = new Map<string, CacheEntry<any>>();
  private lastRequestTime = 0;

  private async rateLimitedFetch(url: string): Promise<any> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
      await new Promise((resolve) =>
        setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest),
      );
    }
    this.lastRequestTime = Date.now();

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new InternalServerErrorException(
          `Nominatim API returned status ${response.status}`,
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      this.logger.error(`Nominatim fetch failed: ${error}`);
      throw new InternalServerErrorException('Failed to contact geocoding service');
    }
  }

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  private mapResult(item: any): GeocodingResult {
    const address = item.address || {};
    return {
      name:
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        item.name ||
        '',
      displayName: item.display_name || '',
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type || item.class || 'unknown',
      country: address.country || '',
      countryCode: (address.country_code || '').toUpperCase(),
      state: address.state || '',
      address,
    };
  }

  async search(query: string, limit = 5): Promise<{ results: GeocodingResult[] }> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Query parameter "q" is required');
    }

    const cacheKey = `search:${query}:${limit}`;
    const cached = this.getCached<{ results: GeocodingResult[] }>(cacheKey);
    if (cached) return cached;

    const url =
      `${NOMINATIM_BASE}/search?` +
      `q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${limit}`;

    this.logger.log(`Forward geocoding: "${query}"`);
    const data = await this.rateLimitedFetch(url);

    const result = {
      results: Array.isArray(data) ? data.map((item: any) => this.mapResult(item)) : [],
    };

    this.setCache(cacheKey, result);
    return result;
  }

  async reverse(lat: number, lng: number): Promise<{ results: GeocodingResult[] }> {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Valid lat and lng parameters are required');
    }

    const cacheKey = `reverse:${lat}:${lng}`;
    const cached = this.getCached<{ results: GeocodingResult[] }>(cacheKey);
    if (cached) return cached;

    const url =
      `${NOMINATIM_BASE}/reverse?` +
      `lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    this.logger.log(`Reverse geocoding: ${lat}, ${lng}`);
    const data = await this.rateLimitedFetch(url);

    const result = {
      results: data && data.lat ? [this.mapResult(data)] : [],
    };

    this.setCache(cacheKey, result);
    return result;
  }

  async autocomplete(
    partial: string,
    limit = 5,
  ): Promise<{ results: GeocodingResult[] }> {
    if (!partial || partial.trim().length === 0) {
      throw new BadRequestException('Query parameter "q" is required');
    }

    const cacheKey = `autocomplete:${partial}:${limit}`;
    const cached = this.getCached<{ results: GeocodingResult[] }>(cacheKey);
    if (cached) return cached;

    // Nominatim doesn't have a dedicated autocomplete endpoint;
    // use search with dedupe and a bounded limit for fast results
    const url =
      `${NOMINATIM_BASE}/search?` +
      `q=${encodeURIComponent(partial)}&format=json&addressdetails=1&limit=${limit}&dedupe=1`;

    this.logger.log(`Autocomplete: "${partial}"`);
    const data = await this.rateLimitedFetch(url);

    const result = {
      results: Array.isArray(data) ? data.map((item: any) => this.mapResult(item)) : [],
    };

    this.setCache(cacheKey, result);
    return result;
  }

  async timezone(
    lat: number,
    lng: number,
  ): Promise<{ timezone: string; utcOffset: string; lat: number; lng: number }> {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Valid lat and lng parameters are required');
    }

    const cacheKey = `timezone:${lat}:${lng}`;
    const cached = this.getCached<any>(cacheKey);
    if (cached) return cached;

    // Use reverse geocoding to determine the country, then estimate timezone
    // For a more precise approach we derive timezone from the coordinates
    // using a lightweight longitude-based estimation plus country context
    const reverseData = await this.reverse(lat, lng);

    const countryCode =
      reverseData.results.length > 0 ? reverseData.results[0].countryCode : '';

    // Estimate UTC offset from longitude (each 15 degrees = 1 hour)
    const rawOffset = Math.round(lng / 15);
    const sign = rawOffset >= 0 ? '+' : '-';
    const absOffset = Math.abs(rawOffset);
    const utcOffset = `UTC${sign}${String(absOffset).padStart(2, '0')}:00`;

    const result = {
      timezone: countryCode
        ? `${countryCode}/${utcOffset}`
        : `Estimated ${utcOffset}`,
      utcOffset,
      lat,
      lng,
    };

    this.setCache(cacheKey, result);
    return result;
  }
}
