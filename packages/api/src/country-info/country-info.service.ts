import { Injectable, Logger, NotFoundException } from '@nestjs/common';

interface CountryCache {
  data: any;
  expiry: number;
}

@Injectable()
export class CountryInfoService {
  private readonly logger = new Logger(CountryInfoService.name);
  private readonly cache = new Map<string, CountryCache>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly BASE_URL = 'https://restcountries.com/v3.1';

  // ── Helpers ──────────────────────────────────────────────────

  private getCached(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiry) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, expiry: Date.now() + this.CACHE_TTL });
  }

  private async fetchJson(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`RestCountries API returned ${response.status}`);
    }
    return response.json();
  }

  private formatCountry(raw: any) {
    return {
      name: {
        common: raw.name?.common ?? null,
        official: raw.name?.official ?? null,
        nativeName: raw.name?.nativeName ?? null,
      },
      code: raw.cca2 ?? null,
      cca3: raw.cca3 ?? null,
      capital: raw.capital ?? [],
      population: raw.population ?? null,
      area: raw.area ?? null,
      region: raw.region ?? null,
      subregion: raw.subregion ?? null,
      languages: raw.languages ?? {},
      currencies: raw.currencies ?? {},
      timezones: raw.timezones ?? [],
      borders: raw.borders ?? [],
      flag: raw.flag ?? null,
      flags: raw.flags ?? {},
      coatOfArms: raw.coatOfArms ?? {},
      callingCodes: raw.idd
        ? {
            root: raw.idd.root ?? '',
            suffixes: raw.idd.suffixes ?? [],
          }
        : null,
      drivingSide: raw.car?.side ?? null,
      continent: raw.continents ?? [],
      latlng: raw.latlng ?? [],
      landlocked: raw.landlocked ?? false,
      maps: raw.maps ?? {},
      startOfWeek: raw.startOfWeek ?? null,
    };
  }

  // ── Get Country by Code ──────────────────────────────────────

  async getCountryByCode(code: string) {
    const upperCode = code.toUpperCase();
    const cacheKey = `country:${upperCode}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchJson(
        `${this.BASE_URL}/alpha/${upperCode}`,
      );

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new NotFoundException(`Country not found: ${upperCode}`);
      }

      const raw = Array.isArray(data) ? data[0] : data;
      const result = this.formatCountry(raw);
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching country ${upperCode}: ${error}`);
      throw error;
    }
  }

  // ── Search Countries by Name ─────────────────────────────────

  async searchCountries(query: string) {
    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchJson(
        `${this.BASE_URL}/name/${encodeURIComponent(query)}`,
      );

      if (!data || (Array.isArray(data) && data.length === 0)) {
        return { query, results: [] };
      }

      const results = (Array.isArray(data) ? data : [data]).map((c: any) =>
        this.formatCountry(c),
      );

      const result = { query, count: results.length, results };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Error searching countries for "${query}": ${error}`);
      return { query, count: 0, results: [] };
    }
  }

  // ── Countries by Region ──────────────────────────────────────

  async getCountriesByRegion(region: string) {
    const lowerRegion = region.toLowerCase();
    const cacheKey = `region:${lowerRegion}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchJson(
        `${this.BASE_URL}/region/${encodeURIComponent(lowerRegion)}`,
      );

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new NotFoundException(`No countries found for region: ${region}`);
      }

      const countries = (Array.isArray(data) ? data : [data])
        .map((c: any) => this.formatCountry(c))
        .sort((a: any, b: any) =>
          (a.name.common ?? '').localeCompare(b.name.common ?? ''),
        );

      const result = { region: lowerRegion, count: countries.length, countries };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching region ${region}: ${error}`);
      throw error;
    }
  }

  // ── Compare Countries ────────────────────────────────────────

  async compareCountries(codes: string[]) {
    if (!codes.length) {
      return { error: 'Provide at least one country code.' };
    }

    try {
      const countries = await Promise.all(
        codes.map((code) => this.getCountryByCode(code.trim())),
      );

      return {
        count: countries.length,
        comparison: countries.map((c: any) => ({
          code: c.code,
          name: c.name.common,
          capital: c.capital,
          population: c.population,
          area: c.area,
          region: c.region,
          subregion: c.subregion,
          languages: c.languages,
          currencies: c.currencies,
          timezones: c.timezones,
          drivingSide: c.drivingSide,
          callingCodes: c.callingCodes,
          flag: c.flag,
        })),
      };
    } catch (error) {
      this.logger.error(`Error comparing countries: ${error}`);
      throw error;
    }
  }

  // ── Neighboring Countries ────────────────────────────────────

  async getNeighbors(code: string) {
    const upperCode = code.toUpperCase();
    const cacheKey = `neighbors:${upperCode}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const country = await this.getCountryByCode(upperCode);

      if (!country.borders || country.borders.length === 0) {
        const result = {
          country: country.name.common,
          code: upperCode,
          message: 'This country has no land borders (island nation or isolated).',
          neighbors: [],
        };
        this.setCache(cacheKey, result);
        return result;
      }

      // Borders are cca3 codes, fetch each via alpha endpoint
      const neighborData = await Promise.all(
        country.borders.map(async (borderCode: string) => {
          try {
            const data = await this.fetchJson(
              `${this.BASE_URL}/alpha/${borderCode}`,
            );
            if (!data) return null;
            const raw = Array.isArray(data) ? data[0] : data;
            return this.formatCountry(raw);
          } catch {
            return { code: borderCode, error: 'Unable to fetch details' };
          }
        }),
      );

      const result = {
        country: country.name.common,
        code: upperCode,
        borderCount: country.borders.length,
        neighbors: neighborData.filter(Boolean),
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching neighbors for ${upperCode}: ${error}`);
      throw error;
    }
  }
}
