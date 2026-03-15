import { Injectable, Logger, NotFoundException } from '@nestjs/common';

interface HolidayCache {
  data: any;
  expiry: number;
}

@Injectable()
export class HolidaysService {
  private readonly logger = new Logger(HolidaysService.name);
  private readonly cache = new Map<string, HolidayCache>();
  private readonly CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours
  private readonly BASE_URL = 'https://date.nager.at/api/v3';

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
      throw new Error(`Nager.Date API returned ${response.status}`);
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    // Some endpoints return empty body for boolean checks
    return null;
  }

  private formatHoliday(raw: any) {
    return {
      date: raw.date,
      localName: raw.localName ?? null,
      name: raw.name,
      countryCode: raw.countryCode,
      fixed: raw.fixed ?? false,
      global: raw.global ?? true,
      counties: raw.counties ?? null,
      launchYear: raw.launchYear ?? null,
      types: raw.types ?? [],
    };
  }

  // ── Public Holidays for Country/Year ─────────────────────────

  async getPublicHolidays(countryCode: string, year: number) {
    const code = countryCode.toUpperCase();
    const cacheKey = `holidays:${code}:${year}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchJson(
        `${this.BASE_URL}/PublicHolidays/${year}/${code}`,
      );

      if (!data) {
        throw new NotFoundException(
          `No holidays found for ${code} in ${year}`,
        );
      }

      const holidays = (Array.isArray(data) ? data : []).map((h: any) =>
        this.formatHoliday(h),
      );

      const result = {
        countryCode: code,
        year,
        count: holidays.length,
        holidays,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Error fetching holidays for ${code}/${year}: ${error}`,
      );
      throw error;
    }
  }

  // ── Upcoming Holidays ────────────────────────────────────────

  async getUpcomingHolidays(countryCode: string) {
    const code = countryCode.toUpperCase();
    const cacheKey = `upcoming:${code}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchJson(
        `${this.BASE_URL}/NextPublicHolidays/${code}`,
      );

      if (!data) {
        throw new NotFoundException(
          `No upcoming holidays found for ${code}`,
        );
      }

      const holidays = (Array.isArray(data) ? data : []).map((h: any) =>
        this.formatHoliday(h),
      );

      const today = new Date().toISOString().split('T')[0];
      const result = {
        countryCode: code,
        asOf: today,
        count: holidays.length,
        holidays,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Error fetching upcoming holidays for ${code}: ${error}`,
      );
      throw error;
    }
  }

  // ── Holidays Today (Worldwide) ──────────────────────────────

  async getHolidaysToday() {
    const cacheKey = `today:${new Date().toISOString().split('T')[0]}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Nager.Date doesn't have a global "today" endpoint,
      // so we check a curated list of popular travel countries
      const popularCountries = [
        'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'JP', 'CN', 'IN', 'BR',
        'AU', 'CA', 'MX', 'KR', 'TH', 'SG', 'AE', 'ZA', 'NZ', 'PT',
        'NL', 'SE', 'NO', 'DK', 'FI', 'AT', 'CH', 'BE', 'PL', 'TR',
      ];

      const today = new Date().toISOString().split('T')[0];
      const year = new Date().getFullYear();

      const checks = await Promise.allSettled(
        popularCountries.map(async (cc) => {
          const holidays = await this.getPublicHolidays(cc, year);
          const todayHolidays = holidays.holidays.filter(
            (h: any) => h.date === today,
          );
          return todayHolidays.length > 0
            ? { countryCode: cc, holidays: todayHolidays }
            : null;
        }),
      );

      const countriesWithHolidays = checks
        .filter(
          (r): r is PromiseFulfilledResult<any> =>
            r.status === 'fulfilled' && r.value !== null,
        )
        .map((r) => r.value);

      const result = {
        date: today,
        countriesChecked: popularCountries.length,
        countriesWithHolidays: countriesWithHolidays.length,
        holidays: countriesWithHolidays,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching today's holidays: ${error}`);
      throw error;
    }
  }

  // ── Long Weekends ────────────────────────────────────────────

  async getLongWeekends(countryCode: string, year: number) {
    const code = countryCode.toUpperCase();
    const cacheKey = `longweekend:${code}:${year}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchJson(
        `${this.BASE_URL}/LongWeekend/${year}/${code}`,
      );

      if (!data) {
        throw new NotFoundException(
          `No long weekend data found for ${code} in ${year}`,
        );
      }

      const longWeekends = (Array.isArray(data) ? data : []).map((lw: any) => ({
        startDate: lw.startDate,
        endDate: lw.endDate,
        dayCount: lw.dayCount,
        needBridgeDay: lw.needBridgeDay ?? false,
      }));

      const result = {
        countryCode: code,
        year,
        count: longWeekends.length,
        longWeekends,
        tip: 'Long weekends are great for short trips! "needBridgeDay" means you need to take a day off to enjoy the full long weekend.',
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Error fetching long weekends for ${code}/${year}: ${error}`,
      );
      throw error;
    }
  }

  // ── Check if Date is Holiday ─────────────────────────────────

  async checkHoliday(countryCode: string, date: string) {
    const code = countryCode.toUpperCase();

    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return { error: 'Invalid date format. Use YYYY-MM-DD.' };
      }

      const year = parsedDate.getFullYear();
      const dateStr = parsedDate.toISOString().split('T')[0];

      // Fetch all holidays for the year and check
      const yearData = await this.getPublicHolidays(code, year);
      const match = yearData.holidays.find((h: any) => h.date === dateStr);

      return {
        countryCode: code,
        date: dateStr,
        isHoliday: !!match,
        holiday: match ?? null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          countryCode: code,
          date,
          isHoliday: false,
          holiday: null,
          note: 'Holiday data not available for this country/year.',
        };
      }
      this.logger.error(
        `Error checking holiday for ${code} on ${date}: ${error}`,
      );
      throw error;
    }
  }
}
