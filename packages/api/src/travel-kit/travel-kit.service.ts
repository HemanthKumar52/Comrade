import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { COUNTRIES } from '../data/countries';
import { TIMEZONE_DATA, calculateSunTimes, hoursToTimeString } from '../data/timezones';
import { PLUG_ADAPTERS, getAdapterRecommendation } from '../data/plug-adapters';
import { VISA_REQUIREMENTS } from '../data/visa-requirements';
import { LOCAL_LAWS } from '../data/local-laws';
import { EMERGENCY_NUMBERS } from '../data/emergency-numbers';

@Injectable()
export class TravelKitService {
  private readonly logger = new Logger(TravelKitService.name);

  constructor(private prisma: PrismaService) {}

  // ── Visa Requirements ──────────────────────────────────────

  getVisaRequirement(passport: string, destination: string) {
    try {
      const key = `${passport.toUpperCase()}-${destination.toUpperCase()}`;
      const visa = VISA_REQUIREMENTS[key];

      if (!visa) {
        this.logger.warn(`Visa info not found for ${key}`);
        return {
          passport: passport.toUpperCase(),
          destination: destination.toUpperCase(),
          requirement: 'unknown' as const,
          maxDays: null,
          notes: 'Visa requirements not available for this combination. Please check with the embassy.',
          processingTime: null,
          officialLink: null,
        };
      }

      return {
        passport: passport.toUpperCase(),
        destination: destination.toUpperCase(),
        requirement: visa.requirement,
        maxDays: visa.maxDays ?? null,
        notes: visa.notes,
        processingTime: visa.processingTime ?? null,
        officialLink: visa.officialLink ?? null,
      };
    } catch (error) {
      this.logger.error(`Error fetching visa requirement: ${error}`);
      throw error;
    }
  }

  // ── Plug Adapter ───────────────────────────────────────────

  getPlugAdapter(country: string, fromCountry?: string) {
    try {
      const code = country.toUpperCase();
      const info = PLUG_ADAPTERS[code];

      if (!info) {
        this.logger.warn(`Plug info not found for ${code}`);
        return {
          country: code,
          plugTypes: [],
          voltage: 'Unknown',
          frequency: 'Unknown',
          notes: 'Plug information not available. Check local standards before travel.',
          adapterRecommendation: null,
        };
      }

      const adapterRecommendation = fromCountry
        ? getAdapterRecommendation(fromCountry, country)
        : null;

      return {
        country: code,
        plugTypes: info.plugTypes,
        voltage: info.voltage,
        frequency: info.frequency,
        notes: info.notes ?? null,
        adapterRecommendation,
      };
    } catch (error) {
      this.logger.error(`Error fetching plug adapter info: ${error}`);
      throw error;
    }
  }

  // ── Timezone Info ──────────────────────────────────────────

  getTimezoneInfo(country: string) {
    try {
      const code = country.toUpperCase();
      const timezones = TIMEZONE_DATA[code];

      if (!timezones || timezones.length === 0) {
        this.logger.warn(`Timezone info not found for ${code}`);
        return {
          country: code,
          timezones: [],
          note: 'Timezone information not available for this country.',
        };
      }

      const now = new Date();
      const timezoneResults = timezones.map((tz) => {
        let currentLocalTime: string;
        try {
          currentLocalTime = now.toLocaleString('en-US', { timeZone: tz.timezone });
        } catch {
          currentLocalTime = 'Unable to calculate';
        }

        return {
          timezone: tz.timezone,
          abbreviation: tz.abbreviation,
          utcOffset: tz.utcOffset,
          utcOffsetString: `UTC${tz.utcOffset >= 0 ? '+' : ''}${tz.utcOffset}`,
          dst: tz.dst,
          currentLocalTime,
        };
      });

      return {
        country: code,
        countryName: COUNTRIES[code]?.name ?? code,
        timezones: timezoneResults,
      };
    } catch (error) {
      this.logger.error(`Error fetching timezone info: ${error}`);
      throw error;
    }
  }

  // ── Timezone Comparison ────────────────────────────────────

  getTimezoneComparison(fromCountry: string, toCountry: string) {
    try {
      const from = fromCountry.toUpperCase();
      const to = toCountry.toUpperCase();
      const fromTz = TIMEZONE_DATA[from];
      const toTz = TIMEZONE_DATA[to];

      if (!fromTz?.length || !toTz?.length) {
        return {
          error: 'Timezone data not available for one or both countries.',
          from,
          to,
        };
      }

      const primaryFrom = fromTz[0];
      const primaryTo = toTz[0];
      const timeDifference = primaryTo.utcOffset - primaryFrom.utcOffset;

      const now = new Date();
      let fromTime: string;
      let toTime: string;
      try {
        fromTime = now.toLocaleString('en-US', { timeZone: primaryFrom.timezone });
        toTime = now.toLocaleString('en-US', { timeZone: primaryTo.timezone });
      } catch {
        fromTime = 'Unable to calculate';
        toTime = 'Unable to calculate';
      }

      const overlapHours = this.calculateOverlap(timeDifference);
      const jetLag = this.getJetLagEstimate(primaryFrom.timezone, primaryTo.timezone);

      return {
        from: {
          country: from,
          countryName: COUNTRIES[from]?.name ?? from,
          timezone: primaryFrom.timezone,
          abbreviation: primaryFrom.abbreviation,
          utcOffset: primaryFrom.utcOffset,
          currentTime: fromTime,
        },
        to: {
          country: to,
          countryName: COUNTRIES[to]?.name ?? to,
          timezone: primaryTo.timezone,
          abbreviation: primaryTo.abbreviation,
          utcOffset: primaryTo.utcOffset,
          currentTime: toTime,
        },
        timeDifferenceHours: timeDifference,
        timeDifferenceString: `${Math.abs(timeDifference)} hours ${timeDifference >= 0 ? 'ahead' : 'behind'}`,
        overlapWorkingHours: overlapHours,
        jetLag,
      };
    } catch (error) {
      this.logger.error(`Error comparing timezones: ${error}`);
      throw error;
    }
  }

  // ── Local Laws ─────────────────────────────────────────────

  getLocalLaws(country: string) {
    try {
      const code = country.toUpperCase();
      const laws = LOCAL_LAWS[code];

      if (!laws) {
        this.logger.warn(`Local laws not found for ${code}`);
        return {
          country: code,
          countryName: COUNTRIES[code]?.name ?? code,
          summary: 'No specific law summary available. Please research local laws before travel.',
          tips: [],
          alcohol: null,
          drugs: null,
          photography: null,
          dress: null,
          lgbtq: null,
          smoking: null,
          driving: null,
          customs: null,
          tipping: null,
        };
      }

      return {
        country: code,
        countryName: COUNTRIES[code]?.name ?? code,
        ...laws,
      };
    } catch (error) {
      this.logger.error(`Error fetching local laws: ${error}`);
      throw error;
    }
  }

  // ── Country Info ───────────────────────────────────────────

  getCountryInfo(country: string) {
    try {
      const code = country.toUpperCase();
      const data = COUNTRIES[code];

      if (!data) {
        throw new NotFoundException(`Country not found: ${code}`);
      }

      return {
        ...data,
        timezones: TIMEZONE_DATA[code] ?? [],
        plugAdapter: PLUG_ADAPTERS[code] ?? null,
        emergencyNumbers: EMERGENCY_NUMBERS[code] ?? null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error fetching country info: ${error}`);
      throw error;
    }
  }

  // ── eSIM Options ───────────────────────────────────────────

  async getEsimOptions(country: string) {
    try {
      return await this.prisma.sIMOption.findMany({
        where: { country: country.toUpperCase(), esim: true },
        orderBy: { price: 'asc' },
      });
    } catch (error) {
      this.logger.error(`Error fetching eSIM options: ${error}`);
      return [];
    }
  }

  // ── Jet Lag Estimate ───────────────────────────────────────

  getJetLagEstimate(fromTz: string, toTz: string) {
    try {
      const now = new Date();
      let fromTime: Date;
      let toTime: Date;

      try {
        fromTime = new Date(now.toLocaleString('en-US', { timeZone: fromTz }));
        toTime = new Date(now.toLocaleString('en-US', { timeZone: toTz }));
      } catch {
        // Fall back to UTC offset-based calculation from data
        const fromOffset = this.findUtcOffset(fromTz);
        const toOffset = this.findUtcOffset(toTz);
        if (fromOffset === null || toOffset === null) {
          return { error: 'Unable to calculate jet lag. Invalid timezone.' };
        }
        const gap = Math.abs(toOffset - fromOffset);
        return this.buildJetLagResult(gap, toOffset > fromOffset ? 'east' : 'west');
      }

      const offsetMs = toTime.getTime() - fromTime.getTime();
      const offsetHours = Math.round((offsetMs / (1000 * 60 * 60)) * 2) / 2;
      const absGap = Math.abs(offsetHours);
      const direction = offsetHours >= 0 ? 'east' : 'west';

      return this.buildJetLagResult(absGap, direction);
    } catch (error) {
      this.logger.error(`Error calculating jet lag: ${error}`);
      return { error: 'Unable to calculate jet lag estimate.' };
    }
  }

  // ── Sunrise/Sunset ─────────────────────────────────────────

  getSunriseSunset(lat: number, lng: number, date: string) {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return { error: 'Invalid date format. Use YYYY-MM-DD.' };
      }

      const sun = calculateSunTimes(lat, lng, d);

      return {
        date,
        latitude: lat,
        longitude: lng,
        sunrise: hoursToTimeString(sun.sunrise),
        sunset: hoursToTimeString(sun.sunset),
        solarNoon: hoursToTimeString(sun.solarNoon),
        goldenHour: {
          start: hoursToTimeString(sun.goldenHourStart),
          end: hoursToTimeString(sun.goldenHourEnd),
        },
        dayLengthHours: sun.dayLengthHours,
        note: 'Times are approximate and in UTC. Adjust for local timezone.',
      };
    } catch (error) {
      this.logger.error(`Error calculating sun times: ${error}`);
      return { error: 'Unable to calculate sun times.' };
    }
  }

  // ── Driving Rules ──────────────────────────────────────────

  getDrivingRules(country: string) {
    try {
      const code = country.toUpperCase();
      const laws = LOCAL_LAWS[code];
      const countryData = COUNTRIES[code];

      if (!laws?.driving) {
        return {
          country: code,
          countryName: countryData?.name ?? code,
          drivingSide: countryData?.drivingSide ?? 'unknown',
          details: 'Detailed driving rules not available for this country.',
        };
      }

      return {
        country: code,
        countryName: countryData?.name ?? code,
        ...laws.driving,
      };
    } catch (error) {
      this.logger.error(`Error fetching driving rules: ${error}`);
      throw error;
    }
  }

  // ── All Travel Kit Info ────────────────────────────────────

  async getAllForCountry(country: string, passport?: string) {
    try {
      const code = country.toUpperCase();

      const [countryInfo, timezone, plugAdapter, laws, esimOptions] = await Promise.all([
        this.getCountryInfo(code),
        this.getTimezoneInfo(code),
        this.getPlugAdapter(code, passport),
        this.getLocalLaws(code),
        this.getEsimOptions(code),
      ]);

      const visa = passport
        ? this.getVisaRequirement(passport, code)
        : null;

      return {
        country: countryInfo,
        visa,
        timezone,
        plugAdapter,
        laws,
        esimOptions,
        emergencyNumbers: EMERGENCY_NUMBERS[code] ?? null,
      };
    } catch (error) {
      this.logger.error(`Error fetching all travel kit info: ${error}`);
      throw error;
    }
  }

  // ── Private Helpers ────────────────────────────────────────

  private calculateOverlap(offsetHours: number): {
    hours: number;
    description: string;
  } {
    const startA = 9;
    const endA = 17;
    const startB = 9 + offsetHours;
    const endB = 17 + offsetHours;
    const overlapStart = Math.max(startA, startB);
    const overlapEnd = Math.min(endA, endB);
    const overlap = Math.max(0, overlapEnd - overlapStart);

    return {
      hours: overlap,
      description: overlap > 0
        ? `${overlap} hours overlap during business hours (9:00-17:00)`
        : 'No overlap during standard business hours',
    };
  }

  private buildJetLagResult(absGap: number, direction: string) {
    const recoveryDays = Math.ceil(absGap / 1.5);
    const severity =
      absGap <= 3 ? 'mild' : absGap <= 6 ? 'moderate' : 'severe';

    const tips: string[] = [
      'Stay hydrated during the flight',
      'Avoid alcohol and caffeine before and during the flight',
      'Set your watch to the destination time zone when you board',
    ];

    if (direction === 'east') {
      tips.push(
        'Try to sleep earlier a few days before departure',
        'Seek morning sunlight at your destination',
        'Eastbound travel is typically harder to adjust to',
      );
    } else {
      tips.push(
        'Try to stay awake until local bedtime',
        'Seek evening sunlight at your destination',
      );
    }

    if (absGap > 5) {
      tips.push(
        'Consider melatonin supplements (consult your doctor)',
        'Break up very long trips with a stopover if possible',
      );
    }

    if (absGap > 8) {
      tips.push('Consider arriving a day early for important events');
    }

    return {
      timezoneGap: absGap,
      direction,
      severity,
      estimatedRecoveryDays: recoveryDays,
      tips,
    };
  }

  private findUtcOffset(timezone: string): number | null {
    for (const tzList of Object.values(TIMEZONE_DATA)) {
      const found = tzList.find((t) => t.timezone === timezone);
      if (found) return found.utcOffset;
    }
    return null;
  }
}
