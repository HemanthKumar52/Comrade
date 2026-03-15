import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry {
  data: any;
  timestamp: number;
}

/** WMO Weather interpretation codes (WW) used by Open-Meteo */
const WMO_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'clear' },
  1: { description: 'Mainly clear', icon: 'mostly-clear' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { description: 'Overcast', icon: 'cloudy' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle' },
  53: { description: 'Moderate drizzle', icon: 'drizzle' },
  55: { description: 'Dense drizzle', icon: 'drizzle' },
  56: { description: 'Light freezing drizzle', icon: 'freezing-drizzle' },
  57: { description: 'Dense freezing drizzle', icon: 'freezing-drizzle' },
  61: { description: 'Slight rain', icon: 'rain-light' },
  63: { description: 'Moderate rain', icon: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain-heavy' },
  66: { description: 'Light freezing rain', icon: 'freezing-rain' },
  67: { description: 'Heavy freezing rain', icon: 'freezing-rain' },
  71: { description: 'Slight snowfall', icon: 'snow-light' },
  73: { description: 'Moderate snowfall', icon: 'snow' },
  75: { description: 'Heavy snowfall', icon: 'snow-heavy' },
  77: { description: 'Snow grains', icon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain-light' },
  81: { description: 'Moderate rain showers', icon: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain-heavy' },
  85: { description: 'Slight snow showers', icon: 'snow-light' },
  86: { description: 'Heavy snow showers', icon: 'snow-heavy' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm-hail' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm-hail' },
};

/** US AQI breakpoint labels */
function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#00E400';
  if (aqi <= 100) return '#FFFF00';
  if (aqi <= 150) return '#FF7E00';
  if (aqi <= 200) return '#FF0000';
  if (aqi <= 300) return '#8F3F97';
  return '#7E0023';
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  private readonly FORECAST_BASE =
    'https://api.open-meteo.com/v1/forecast';
  private readonly AIR_QUALITY_BASE =
    'https://air-quality-api.open-meteo.com/v1/air-quality';

  // --------------- cache helpers ---------------

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

  // --------------- Open-Meteo: current weather ---------------

  async getCurrentWeather(lat: number, lng: number) {
    const cacheKey = `current:${lat}:${lng}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url =
        `${this.FORECAST_BASE}?latitude=${lat}&longitude=${lng}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index` +
        `&daily=sunrise,sunset` +
        `&timezone=auto&forecast_days=1`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned ${response.status}`);
      }
      const data = await response.json();
      const current = data.current;
      const daily = data.daily;
      const wmo = WMO_CODES[current.weather_code] ?? {
        description: 'Unknown',
        icon: 'unknown',
      };

      const result = {
        source: 'open-meteo',
        coordinates: { lat, lng },
        timezone: data.timezone,
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
        description: wmo.description,
        icon: wmo.icon,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        uvIndex: current.uv_index,
        sunrise: daily?.sunrise?.[0] ?? null,
        sunset: daily?.sunset?.[0] ?? null,
        units: {
          temperature: data.current_units?.temperature_2m ?? '°C',
          windSpeed: data.current_units?.wind_speed_10m ?? 'km/h',
          precipitation: data.current_units?.precipitation ?? 'mm',
        },
        retrievedAt: new Date().toISOString(),
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch current weather: ${error.message}`);
      return this.getFallbackCurrentWeather(lat, lng);
    }
  }

  // --------------- Open-Meteo: multi-day forecast ---------------

  async getForecast(lat: number, lng: number, days: number = 7) {
    // Open-Meteo supports up to 16 days
    const clampedDays = Math.min(Math.max(days, 1), 16);
    const cacheKey = `forecast:${lat}:${lng}:${clampedDays}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url =
        `${this.FORECAST_BASE}?latitude=${lat}&longitude=${lng}` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset` +
        `&timezone=auto&forecast_days=${clampedDays}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned ${response.status}`);
      }
      const data = await response.json();
      const daily = data.daily;

      const forecast = (daily.time as string[]).map((date: string, i: number) => {
        const wmo = WMO_CODES[daily.weather_code[i]] ?? {
          description: 'Unknown',
          icon: 'unknown',
        };
        return {
          date,
          tempMax: daily.temperature_2m_max[i],
          tempMin: daily.temperature_2m_min[i],
          precipitationSum: daily.precipitation_sum[i],
          weatherCode: daily.weather_code[i],
          description: wmo.description,
          icon: wmo.icon,
          sunrise: daily.sunrise[i],
          sunset: daily.sunset[i],
        };
      });

      const result = {
        source: 'open-meteo',
        coordinates: { lat, lng },
        timezone: data.timezone,
        units: {
          temperature: data.daily_units?.temperature_2m_max ?? '°C',
          precipitation: data.daily_units?.precipitation_sum ?? 'mm',
        },
        days: clampedDays,
        forecast,
        retrievedAt: new Date().toISOString(),
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch forecast: ${error.message}`);
      return this.getFallbackForecast(days);
    }
  }

  // --------------- Open-Meteo: air quality ---------------

  async getAirQuality(lat: number, lng: number) {
    const cacheKey = `air-quality:${lat}:${lng}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const url =
        `${this.AIR_QUALITY_BASE}?latitude=${lat}&longitude=${lng}` +
        `&current=pm2_5,pm10,us_aqi,carbon_monoxide,nitrogen_dioxide,ozone` +
        `&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo Air Quality API returned ${response.status}`);
      }
      const data = await response.json();
      const current = data.current;
      const aqi = current.us_aqi;

      const result = {
        source: 'open-meteo',
        coordinates: { lat, lng },
        timezone: data.timezone,
        aqi: {
          value: aqi,
          label: aqi != null ? getAqiLabel(aqi) : 'Unknown',
          color: aqi != null ? getAqiColor(aqi) : '#999999',
        },
        pollutants: {
          pm2_5: { value: current.pm2_5, unit: data.current_units?.pm2_5 ?? 'μg/m³' },
          pm10: { value: current.pm10, unit: data.current_units?.pm10 ?? 'μg/m³' },
          carbonMonoxide: { value: current.carbon_monoxide, unit: data.current_units?.carbon_monoxide ?? 'μg/m³' },
          nitrogenDioxide: { value: current.nitrogen_dioxide, unit: data.current_units?.nitrogen_dioxide ?? 'μg/m³' },
          ozone: { value: current.ozone, unit: data.current_units?.ozone ?? 'μg/m³' },
        },
        retrievedAt: new Date().toISOString(),
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch air quality: ${error.message}`);
      return {
        coordinates: { lat, lng },
        aqi: { value: null, label: 'Unavailable', color: '#999999' },
        pollutants: {},
        error: 'Unable to fetch air quality data at this time.',
      };
    }
  }

  // --------------- Alerts (best-effort from forecast data) ---------------

  async getAlerts(lat: number, lng: number) {
    const cacheKey = `alerts:${lat}:${lng}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    // Open-Meteo does not provide a dedicated alerts endpoint.
    // We derive simple warnings from current conditions.
    try {
      const url =
        `${this.FORECAST_BASE}?latitude=${lat}&longitude=${lng}` +
        `&current=temperature_2m,precipitation,weather_code,wind_speed_10m,uv_index` +
        `&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned ${response.status}`);
      }
      const data = await response.json();
      const c = data.current;
      const alerts: Array<{ type: string; severity: string; message: string }> = [];

      if (c.temperature_2m != null && c.temperature_2m >= 40) {
        alerts.push({ type: 'extreme-heat', severity: 'warning', message: `Extreme heat: ${c.temperature_2m}°C. Stay hydrated and avoid prolonged sun exposure.` });
      } else if (c.temperature_2m != null && c.temperature_2m >= 35) {
        alerts.push({ type: 'heat', severity: 'advisory', message: `High temperature: ${c.temperature_2m}°C. Take precautions against heat.` });
      }

      if (c.temperature_2m != null && c.temperature_2m <= -15) {
        alerts.push({ type: 'extreme-cold', severity: 'warning', message: `Extreme cold: ${c.temperature_2m}°C. Risk of frostbite and hypothermia.` });
      } else if (c.temperature_2m != null && c.temperature_2m <= -5) {
        alerts.push({ type: 'cold', severity: 'advisory', message: `Very cold: ${c.temperature_2m}°C. Dress warmly and limit outdoor exposure.` });
      }

      if (c.wind_speed_10m != null && c.wind_speed_10m >= 80) {
        alerts.push({ type: 'storm-wind', severity: 'warning', message: `Storm-force winds: ${c.wind_speed_10m} km/h. Seek shelter immediately.` });
      } else if (c.wind_speed_10m != null && c.wind_speed_10m >= 50) {
        alerts.push({ type: 'high-wind', severity: 'advisory', message: `High winds: ${c.wind_speed_10m} km/h. Secure loose objects.` });
      }

      if (c.precipitation != null && c.precipitation >= 10) {
        alerts.push({ type: 'heavy-precipitation', severity: 'advisory', message: `Heavy precipitation: ${c.precipitation} mm. Watch for flooding.` });
      }

      if (c.uv_index != null && c.uv_index >= 11) {
        alerts.push({ type: 'extreme-uv', severity: 'warning', message: `Extreme UV index: ${c.uv_index}. Avoid sun exposure.` });
      } else if (c.uv_index != null && c.uv_index >= 8) {
        alerts.push({ type: 'high-uv', severity: 'advisory', message: `Very high UV index: ${c.uv_index}. Use sunscreen and seek shade.` });
      }

      if ([95, 96, 99].includes(c.weather_code)) {
        alerts.push({ type: 'thunderstorm', severity: 'warning', message: 'Thunderstorm activity detected. Stay indoors if possible.' });
      }

      const result = {
        source: 'open-meteo',
        coordinates: { lat, lng },
        alerts,
        alertCount: alerts.length,
        note: 'Alerts are derived from current conditions. For official severe weather warnings, consult local meteorological services.',
        retrievedAt: new Date().toISOString(),
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch alerts: ${error.message}`);
      return {
        alerts: [],
        alertCount: 0,
        error: 'Unable to fetch weather alerts at this time.',
      };
    }
  }

  // --------------- Static data: best time to visit ---------------

  getBestTimeToVisit(country: string) {
    const code = country.toUpperCase();
    const data = BEST_TIME_DATA[code];
    if (!data) {
      return { error: `No data available for country code: ${code}` };
    }
    return data;
  }

  // --------------- Static data: climate ---------------

  getClimate(country: string) {
    const code = country.toUpperCase();
    const data = CLIMATE_DATA[code];
    if (!data) {
      return { error: `No climate data available for country code: ${code}` };
    }
    return data;
  }

  // --------------- Fallbacks ---------------

  private getFallbackCurrentWeather(lat: number, lng: number) {
    return {
      source: 'fallback',
      coordinates: { lat, lng },
      temperature: null,
      feelsLike: null,
      humidity: null,
      description: 'Weather data temporarily unavailable',
      icon: null,
      windSpeed: null,
      note: 'Open-Meteo API is unreachable. Please try again later.',
    };
  }

  private getFallbackForecast(days: number) {
    return {
      source: 'fallback',
      days,
      forecast: Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          tempMin: null,
          tempMax: null,
          precipitationSum: null,
          note: 'Forecast data temporarily unavailable',
        };
      }),
      note: 'Open-Meteo API is unreachable. Please try again later.',
    };
  }
}

// --------------- Static datasets ---------------

const BEST_TIME_DATA: Record<string, any> = {
  IN: { country: 'India', bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'], worstMonths: ['June', 'July', 'August'], peakSeason: 'November-February', shoulder: 'March, September-October', summary: 'Winter (Oct-Mar) is best for most regions. Monsoon (Jun-Sep) brings heavy rain but is great for Kerala and Northeast. Summer (Apr-Jun) is ideal for hill stations.', regions: { north: 'Oct-Mar (cold winters, hot summers)', south: 'Nov-Feb (cooler, less humid)', rajasthan: 'Oct-Mar (avoid scorching summers)', himalayan: 'Apr-Jun, Sep-Oct (clear skies, trekking)' } },
  US: { country: 'United States', bestMonths: ['April', 'May', 'September', 'October'], worstMonths: ['January', 'February'], peakSeason: 'June-August', shoulder: 'April-May, September-October', summary: 'Spring and fall offer mild weather and fewer crowds. Summer is peak season. Winter is great for skiing.', regions: { northeast: 'Sep-Oct (fall foliage)', west: 'May-Sep (national parks)', south: 'Mar-May (pleasant temps)', hawaii: 'Apr-Jun (dry season, fewer tourists)' } },
  GB: { country: 'United Kingdom', bestMonths: ['May', 'June', 'July', 'August', 'September'], worstMonths: ['November', 'December', 'January', 'February'], peakSeason: 'June-August', shoulder: 'May, September', summary: 'Summer offers longest days and warmest weather. Spring brings blooming gardens. Winter is cold and dark but festive.' },
  JP: { country: 'Japan', bestMonths: ['March', 'April', 'May', 'October', 'November'], worstMonths: ['June', 'July', 'August'], peakSeason: 'March-April (cherry blossom), October-November (autumn leaves)', shoulder: 'May, September', summary: 'Cherry blossom season (late Mar-Apr) and autumn foliage (Oct-Nov) are magical. Summer is hot and humid with a rainy season in June.' },
  FR: { country: 'France', bestMonths: ['April', 'May', 'June', 'September', 'October'], worstMonths: ['January', 'February'], peakSeason: 'July-August', shoulder: 'April-June, September-October', summary: 'Spring and early autumn offer pleasant weather without summer crowds. Paris is lovely in spring. The Riviera shines June-September.' },
  DE: { country: 'Germany', bestMonths: ['May', 'June', 'July', 'August', 'September'], worstMonths: ['November', 'December', 'January', 'February'], peakSeason: 'June-August', shoulder: 'May, September-October', summary: 'Summer is warm and ideal. December is magical for Christmas markets. Oktoberfest runs late Sept to early Oct.' },
  AU: { country: 'Australia', bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'], worstMonths: ['January', 'February'], peakSeason: 'December-February (summer)', shoulder: 'September-November, March-May', summary: 'Seasons are reversed from Northern Hemisphere. Spring (Sep-Nov) and autumn (Mar-May) are ideal. Summer is hot. Winter is mild in the north.' },
  TH: { country: 'Thailand', bestMonths: ['November', 'December', 'January', 'February', 'March'], worstMonths: ['May', 'June', 'July', 'August', 'September'], peakSeason: 'November-February', shoulder: 'March-April, October', summary: 'Cool dry season (Nov-Feb) is ideal. Hot season (Mar-May) is sweltering. Monsoon (May-Oct) brings rain but lower prices.' },
  CN: { country: 'China', bestMonths: ['April', 'May', 'September', 'October'], worstMonths: ['January', 'February', 'July', 'August'], peakSeason: 'October (Golden Week)', shoulder: 'April-May, September', summary: 'Spring and autumn offer mild weather. Summer is hot and humid. Winter is cold in the north. Avoid Golden Week (early Oct) for fewer crowds.' },
  SG: { country: 'Singapore', bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August'], worstMonths: ['November', 'December', 'January'], peakSeason: 'Year-round destination', shoulder: 'February-April', summary: 'Hot and humid year-round (27-32C). Nov-Jan is monsoon season with heavy rain. Feb-Apr tends to be driest.' },
  KR: { country: 'South Korea', bestMonths: ['April', 'May', 'September', 'October', 'November'], worstMonths: ['July', 'August'], peakSeason: 'April (cherry blossoms), October (autumn foliage)', shoulder: 'May, September', summary: 'Spring cherry blossoms and autumn foliage are spectacular. Summer is hot and rainy. Winter is cold but great for skiing.' },
  IT: { country: 'Italy', bestMonths: ['April', 'May', 'June', 'September', 'October'], worstMonths: ['January', 'February'], peakSeason: 'July-August', shoulder: 'April-June, September-October', summary: 'Spring and autumn are perfect - pleasant weather, fewer tourists. Summer is crowded and hot. Winter is quiet except for ski areas.' },
  ES: { country: 'Spain', bestMonths: ['April', 'May', 'June', 'September', 'October'], worstMonths: ['July', 'August'], peakSeason: 'July-August', shoulder: 'April-June, September-October', summary: 'Spring and fall offer ideal temperatures. Summer is scorching in the interior. Southern coast is pleasant most of the year.' },
  BR: { country: 'Brazil', bestMonths: ['May', 'June', 'July', 'August', 'September'], worstMonths: ['December', 'January', 'February', 'March'], peakSeason: 'December-February (summer/Carnival)', shoulder: 'May-June, September-October', summary: 'Brazilian winter (May-Sep) offers cooler temps and dry weather. Summer is festival season but hot and rainy. Best for Amazon: Jun-Nov.' },
  AE: { country: 'United Arab Emirates', bestMonths: ['November', 'December', 'January', 'February', 'March'], worstMonths: ['June', 'July', 'August', 'September'], peakSeason: 'December-February', shoulder: 'October-November, March-April', summary: 'Winter months (Nov-Mar) are pleasant at 20-25C. Summer temperatures exceed 45C and are unbearable outdoors.' },
  NZ: { country: 'New Zealand', bestMonths: ['December', 'January', 'February', 'March'], worstMonths: ['June', 'July', 'August'], peakSeason: 'December-February', shoulder: 'March-April, October-November', summary: 'Summer (Dec-Feb) is ideal for outdoor activities. Autumn (Mar-May) brings stunning foliage. Winter is mild but rainy, great for skiing.' },
  CA: { country: 'Canada', bestMonths: ['June', 'July', 'August', 'September'], worstMonths: ['December', 'January', 'February'], peakSeason: 'July-August', shoulder: 'May-June, September-October', summary: 'Summer is warm and perfect for outdoors. Fall foliage (Sep-Oct) is spectacular. Winter is extremely cold but great for winter sports.' },
  MX: { country: 'Mexico', bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'], worstMonths: ['June', 'July', 'August', 'September'], peakSeason: 'December-March', shoulder: 'April-May, October-November', summary: 'Dry season (Nov-Apr) is ideal. Rainy season (Jun-Oct) brings afternoon showers and hurricane risk on coasts.' },
  TR: { country: 'Turkey', bestMonths: ['April', 'May', 'September', 'October'], worstMonths: ['January', 'February'], peakSeason: 'July-August', shoulder: 'April-May, September-October', summary: 'Spring and autumn are ideal for Istanbul and Cappadocia. Summer is great for the coast but very hot inland. Winter for skiing.' },
  NP: { country: 'Nepal', bestMonths: ['October', 'November', 'March', 'April', 'May'], worstMonths: ['June', 'July', 'August'], peakSeason: 'October-November', shoulder: 'March-May', summary: 'Autumn (Oct-Nov) offers clear Himalayan views and trekking weather. Spring (Mar-May) brings rhododendrons. Monsoon (Jun-Sep) causes landslides.' },
  LK: { country: 'Sri Lanka', bestMonths: ['December', 'January', 'February', 'March'], worstMonths: ['May', 'June', 'October', 'November'], peakSeason: 'December-March (west coast)', shoulder: 'April, July-September (east coast)', summary: 'West and south coasts: Dec-Mar. East coast: May-Sep. There is always a dry coast somewhere in Sri Lanka.' },
  VN: { country: 'Vietnam', bestMonths: ['February', 'March', 'April'], worstMonths: ['September', 'October', 'November'], peakSeason: 'December-February (south), March-April (central)', shoulder: 'February-April', summary: 'Vietnam stretches 1,650km so climates vary. South: Nov-Apr dry. Central: Feb-May. North: Oct-Dec and Mar-Apr.' },
  ID: { country: 'Indonesia', bestMonths: ['April', 'May', 'June', 'July', 'August', 'September'], worstMonths: ['December', 'January', 'February'], peakSeason: 'July-August', shoulder: 'April-June, September-October', summary: 'Dry season (Apr-Oct) is ideal. Bali peak is Jul-Aug. Rainy season (Nov-Mar) still has sunny mornings.' },
  MY: { country: 'Malaysia', bestMonths: ['March', 'April', 'May', 'June', 'July', 'August', 'September'], worstMonths: ['November', 'December', 'January'], peakSeason: 'June-August', shoulder: 'March-May', summary: 'West coast: dry Dec-Feb. East coast: dry Mar-Oct. Borneo: best Mar-Oct. Hot and humid year-round.' },
  PH: { country: 'Philippines', bestMonths: ['December', 'January', 'February', 'March', 'April', 'May'], worstMonths: ['July', 'August', 'September', 'October'], peakSeason: 'January-April', shoulder: 'November-December, May', summary: 'Dry season (Nov-May) is best. Typhoon season (Jun-Nov) can be risky. Christmas season is festive and fun.' },
  EG: { country: 'Egypt', bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'], worstMonths: ['June', 'July', 'August'], peakSeason: 'October-February', shoulder: 'March-April, September', summary: 'Winter is ideal for temple visits - pleasant at 20-25C. Summer is scorching (40C+). Red Sea coast is warm year-round.' },
  ZA: { country: 'South Africa', bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'], worstMonths: ['June', 'July', 'August'], peakSeason: 'December-February (summer)', shoulder: 'September-November, March-May', summary: 'Spring (Sep-Nov) and autumn (Mar-May) are ideal. Summer is hot. Winter is best for safari (dry season, animals gather at waterholes).' },
  KE: { country: 'Kenya', bestMonths: ['January', 'February', 'July', 'August', 'September', 'October'], worstMonths: ['April', 'May'], peakSeason: 'July-October (Great Migration)', shoulder: 'January-February, November-December', summary: 'Great Migration in Masai Mara is Jul-Oct. Long rains Apr-May. Short rains Nov. Jan-Feb is hot and dry.' },
  RU: { country: 'Russia', bestMonths: ['May', 'June', 'July', 'August', 'September'], worstMonths: ['November', 'December', 'January', 'February', 'March'], peakSeason: 'June-August (White Nights in St. Petersburg)', shoulder: 'May, September', summary: 'Summer is brief but wonderful with long days. White Nights in St. Petersburg (late Jun) are magical. Winter is bitterly cold but beautiful.' },
  PT: { country: 'Portugal', bestMonths: ['April', 'May', 'June', 'September', 'October'], worstMonths: ['December', 'January', 'February'], peakSeason: 'July-August', shoulder: 'April-June, September-October', summary: 'Spring and early autumn are ideal. Summer is hot and crowded in the Algarve. Mild winters with rain.' },
  GR: { country: 'Greece', bestMonths: ['April', 'May', 'June', 'September', 'October'], worstMonths: ['January', 'February'], peakSeason: 'July-August', shoulder: 'April-June, September-October', summary: 'Spring and autumn are perfect for islands and mainland. Summer is hot and very crowded. Winter is mild in Athens, cold in mountains.' },
  CH: { country: 'Switzerland', bestMonths: ['June', 'July', 'August', 'September'], worstMonths: ['November', 'March'], peakSeason: 'July-August (summer), December-March (ski)', shoulder: 'May-June, September-October', summary: 'Summer for hiking and lakes. Winter for world-class skiing. Shoulder seasons offer fewer crowds and lower prices.' },
  NL: { country: 'Netherlands', bestMonths: ['April', 'May', 'June', 'July', 'August', 'September'], worstMonths: ['November', 'December', 'January', 'February'], peakSeason: 'April-May (tulip season)', shoulder: 'June-September', summary: 'Tulip season (mid-Apr to mid-May) is iconic. Summer is warm and pleasant. Winter is cold, wet, and dark.' },
  SE: { country: 'Sweden', bestMonths: ['June', 'July', 'August'], worstMonths: ['November', 'December', 'January', 'February'], peakSeason: 'June-August (Midnight Sun)', shoulder: 'May, September', summary: 'Summer brings Midnight Sun in the north and long warm days. Winter is dark but great for Northern Lights and ice hotels.' },
  NO: { country: 'Norway', bestMonths: ['June', 'July', 'August'], worstMonths: ['November', 'December', 'January'], peakSeason: 'June-August', shoulder: 'May, September', summary: 'Summer for fjords and Midnight Sun. Winter (Nov-Feb) for Northern Lights. Spring brings melting waterfalls.' },
  AT: { country: 'Austria', bestMonths: ['May', 'June', 'July', 'August', 'September'], worstMonths: ['November', 'March'], peakSeason: 'July-August (summer), December-March (ski)', shoulder: 'May-June, September-October', summary: 'Summer for Alps hiking and lake swimming. Winter for world-class skiing. Vienna is lovely in spring and December.' },
  SA: { country: 'Saudi Arabia', bestMonths: ['November', 'December', 'January', 'February', 'March'], worstMonths: ['June', 'July', 'August'], peakSeason: 'November-February', shoulder: 'March-April, October', summary: 'Winter is the only comfortable time to visit. Summer temperatures exceed 50C in some areas.' },
  BT: { country: 'Bhutan', bestMonths: ['March', 'April', 'May', 'September', 'October', 'November'], worstMonths: ['June', 'July', 'August'], peakSeason: 'October-November (Paro Tshechu festival)', shoulder: 'March-May', summary: 'Autumn (Sep-Nov) offers clear Himalayan views and festivals. Spring (Mar-May) brings blooming rhododendrons. Monsoon Jun-Aug.' },
  MM: { country: 'Myanmar', bestMonths: ['November', 'December', 'January', 'February'], worstMonths: ['June', 'July', 'August'], peakSeason: 'November-February', shoulder: 'March, October', summary: 'Cool dry season (Nov-Feb) is ideal. Hot season (Mar-May) is scorching. Monsoon (Jun-Oct) makes travel difficult.' },
};

const CLIMATE_DATA: Record<string, any> = {
  IN: { country: 'India', climateZone: 'Tropical to Temperate', avgTempByMonth: { Jan: 14, Feb: 17, Mar: 23, Apr: 30, May: 33, Jun: 33, Jul: 30, Aug: 29, Sep: 29, Oct: 27, Nov: 21, Dec: 15 }, rainySeason: 'June-September (Southwest Monsoon)', drySeason: 'October-May', avgRainfallMm: 1170, humidityRange: '40-90%' },
  US: { country: 'United States', climateZone: 'Varied (Continental, Subtropical, Arid, Mediterranean)', avgTempByMonth: { Jan: 2, Feb: 4, Mar: 10, Apr: 15, May: 21, Jun: 26, Jul: 29, Aug: 28, Sep: 24, Oct: 17, Nov: 10, Dec: 4 }, rainySeason: 'Varies by region', drySeason: 'Varies by region', avgRainfallMm: 715, humidityRange: '30-80%' },
  GB: { country: 'United Kingdom', climateZone: 'Temperate Maritime', avgTempByMonth: { Jan: 5, Feb: 5, Mar: 7, Apr: 10, May: 13, Jun: 16, Jul: 18, Aug: 18, Sep: 15, Oct: 12, Nov: 8, Dec: 5 }, rainySeason: 'October-January', drySeason: 'May-August', avgRainfallMm: 1220, humidityRange: '70-90%' },
  JP: { country: 'Japan', climateZone: 'Temperate with four distinct seasons', avgTempByMonth: { Jan: 5, Feb: 6, Mar: 9, Apr: 14, May: 19, Jun: 22, Jul: 26, Aug: 27, Sep: 24, Oct: 18, Nov: 13, Dec: 8 }, rainySeason: 'June-July (Tsuyu/rainy season), August-October (typhoons)', drySeason: 'December-February', avgRainfallMm: 1668, humidityRange: '50-80%' },
  FR: { country: 'France', climateZone: 'Oceanic to Mediterranean', avgTempByMonth: { Jan: 5, Feb: 6, Mar: 10, Apr: 13, May: 17, Jun: 20, Jul: 23, Aug: 22, Sep: 19, Oct: 14, Nov: 9, Dec: 5 }, rainySeason: 'October-December', drySeason: 'June-August', avgRainfallMm: 770, humidityRange: '60-80%' },
  DE: { country: 'Germany', climateZone: 'Temperate Continental', avgTempByMonth: { Jan: 1, Feb: 2, Mar: 6, Apr: 10, May: 15, Jun: 18, Jul: 20, Aug: 20, Sep: 16, Oct: 10, Nov: 5, Dec: 2 }, rainySeason: 'June-August (summer thunderstorms)', drySeason: 'February-April', avgRainfallMm: 700, humidityRange: '65-85%' },
  AU: { country: 'Australia', climateZone: 'Arid to Tropical to Temperate', avgTempByMonth: { Jan: 26, Feb: 26, Mar: 24, Apr: 21, May: 17, Jun: 14, Jul: 13, Aug: 15, Sep: 17, Oct: 20, Nov: 22, Dec: 25 }, rainySeason: 'November-March (northern tropical)', drySeason: 'May-October (northern dry season)', avgRainfallMm: 534, humidityRange: '30-70%' },
  TH: { country: 'Thailand', climateZone: 'Tropical', avgTempByMonth: { Jan: 27, Feb: 28, Mar: 30, Apr: 31, May: 30, Jun: 30, Jul: 29, Aug: 29, Sep: 28, Oct: 28, Nov: 27, Dec: 26 }, rainySeason: 'May-October (Southwest Monsoon)', drySeason: 'November-April', avgRainfallMm: 1500, humidityRange: '60-90%' },
  CN: { country: 'China', climateZone: 'Varied (Subarctic to Tropical)', avgTempByMonth: { Jan: -2, Feb: 2, Mar: 9, Apr: 16, May: 22, Jun: 26, Jul: 28, Aug: 27, Sep: 22, Oct: 15, Nov: 7, Dec: 0 }, rainySeason: 'May-September', drySeason: 'October-April', avgRainfallMm: 645, humidityRange: '40-80%' },
  SG: { country: 'Singapore', climateZone: 'Tropical Rainforest', avgTempByMonth: { Jan: 27, Feb: 27, Mar: 28, Apr: 28, May: 28, Jun: 28, Jul: 28, Aug: 28, Sep: 28, Oct: 28, Nov: 27, Dec: 27 }, rainySeason: 'November-January (Northeast Monsoon)', drySeason: 'February-April (driest)', avgRainfallMm: 2340, humidityRange: '75-95%' },
  KR: { country: 'South Korea', climateZone: 'Temperate Continental', avgTempByMonth: { Jan: -3, Feb: -1, Mar: 5, Apr: 12, May: 18, Jun: 22, Jul: 25, Aug: 26, Sep: 21, Oct: 14, Nov: 6, Dec: -1 }, rainySeason: 'June-September (monsoon)', drySeason: 'October-May', avgRainfallMm: 1274, humidityRange: '50-85%' },
  IT: { country: 'Italy', climateZone: 'Mediterranean to Alpine', avgTempByMonth: { Jan: 7, Feb: 8, Mar: 11, Apr: 14, May: 19, Jun: 23, Jul: 26, Aug: 26, Sep: 22, Oct: 17, Nov: 12, Dec: 8 }, rainySeason: 'October-November', drySeason: 'June-August', avgRainfallMm: 832, humidityRange: '55-80%' },
  ES: { country: 'Spain', climateZone: 'Mediterranean', avgTempByMonth: { Jan: 9, Feb: 10, Mar: 13, Apr: 15, May: 19, Jun: 24, Jul: 28, Aug: 27, Sep: 23, Oct: 18, Nov: 12, Dec: 9 }, rainySeason: 'October-December', drySeason: 'June-September', avgRainfallMm: 636, humidityRange: '50-75%' },
  BR: { country: 'Brazil', climateZone: 'Tropical to Subtropical', avgTempByMonth: { Jan: 27, Feb: 27, Mar: 26, Apr: 25, May: 23, Jun: 22, Jul: 21, Aug: 22, Sep: 24, Oct: 25, Nov: 26, Dec: 27 }, rainySeason: 'October-March', drySeason: 'April-September', avgRainfallMm: 1761, humidityRange: '60-90%' },
  AE: { country: 'United Arab Emirates', climateZone: 'Hot Desert', avgTempByMonth: { Jan: 19, Feb: 20, Mar: 23, Apr: 28, May: 33, Jun: 35, Jul: 37, Aug: 37, Sep: 34, Oct: 30, Nov: 25, Dec: 21 }, rainySeason: 'November-March (very minimal)', drySeason: 'Year-round arid', avgRainfallMm: 78, humidityRange: '40-90%' },
  NZ: { country: 'New Zealand', climateZone: 'Temperate Maritime', avgTempByMonth: { Jan: 20, Feb: 20, Mar: 18, Apr: 16, May: 13, Jun: 10, Jul: 9, Aug: 10, Sep: 12, Oct: 14, Nov: 16, Dec: 18 }, rainySeason: 'June-August (winter)', drySeason: 'January-March', avgRainfallMm: 1732, humidityRange: '70-85%' },
  CA: { country: 'Canada', climateZone: 'Continental to Subarctic', avgTempByMonth: { Jan: -10, Feb: -8, Mar: -2, Apr: 7, May: 14, Jun: 19, Jul: 22, Aug: 21, Sep: 16, Oct: 9, Nov: 2, Dec: -7 }, rainySeason: 'April-September', drySeason: 'October-March (snow)', avgRainfallMm: 537, humidityRange: '50-80%' },
  MX: { country: 'Mexico', climateZone: 'Tropical to Arid', avgTempByMonth: { Jan: 19, Feb: 20, Mar: 22, Apr: 25, May: 26, Jun: 25, Jul: 24, Aug: 24, Sep: 23, Oct: 22, Nov: 21, Dec: 19 }, rainySeason: 'June-October', drySeason: 'November-May', avgRainfallMm: 758, humidityRange: '50-80%' },
  TR: { country: 'Turkey', climateZone: 'Mediterranean to Continental', avgTempByMonth: { Jan: 5, Feb: 6, Mar: 10, Apr: 14, May: 19, Jun: 24, Jul: 27, Aug: 27, Sep: 23, Oct: 17, Nov: 11, Dec: 7 }, rainySeason: 'November-March', drySeason: 'June-September', avgRainfallMm: 643, humidityRange: '55-80%' },
  NP: { country: 'Nepal', climateZone: 'Subtropical to Alpine', avgTempByMonth: { Jan: 10, Feb: 13, Mar: 18, Apr: 22, May: 24, Jun: 25, Jul: 24, Aug: 24, Sep: 23, Oct: 20, Nov: 15, Dec: 11 }, rainySeason: 'June-September (monsoon)', drySeason: 'October-May', avgRainfallMm: 1500, humidityRange: '45-90%' },
  EG: { country: 'Egypt', climateZone: 'Hot Desert', avgTempByMonth: { Jan: 14, Feb: 15, Mar: 18, Apr: 22, May: 27, Jun: 30, Jul: 32, Aug: 31, Sep: 29, Oct: 25, Nov: 20, Dec: 15 }, rainySeason: 'November-March (minimal)', drySeason: 'Year-round', avgRainfallMm: 25, humidityRange: '30-60%' },
  ZA: { country: 'South Africa', climateZone: 'Subtropical to Semi-arid', avgTempByMonth: { Jan: 25, Feb: 25, Mar: 23, Apr: 20, May: 17, Jun: 14, Jul: 13, Aug: 15, Sep: 18, Oct: 20, Nov: 22, Dec: 24 }, rainySeason: 'October-March (east), May-August (west/Cape)', drySeason: 'April-September (east)', avgRainfallMm: 495, humidityRange: '40-75%' },
  KE: { country: 'Kenya', climateZone: 'Tropical', avgTempByMonth: { Jan: 26, Feb: 26, Mar: 26, Apr: 24, May: 22, Jun: 21, Jul: 20, Aug: 21, Sep: 23, Oct: 24, Nov: 24, Dec: 25 }, rainySeason: 'March-May (long rains), October-December (short rains)', drySeason: 'January-February, June-September', avgRainfallMm: 900, humidityRange: '55-80%' },
  RU: { country: 'Russia', climateZone: 'Continental to Subarctic', avgTempByMonth: { Jan: -10, Feb: -9, Mar: -3, Apr: 6, May: 13, Jun: 18, Jul: 20, Aug: 18, Sep: 12, Oct: 5, Nov: -2, Dec: -7 }, rainySeason: 'June-August', drySeason: 'November-March (snowfall)', avgRainfallMm: 575, humidityRange: '55-85%' },
  PT: { country: 'Portugal', climateZone: 'Mediterranean', avgTempByMonth: { Jan: 11, Feb: 12, Mar: 14, Apr: 16, May: 18, Jun: 22, Jul: 24, Aug: 24, Sep: 22, Oct: 18, Nov: 14, Dec: 12 }, rainySeason: 'October-March', drySeason: 'June-September', avgRainfallMm: 854, humidityRange: '60-85%' },
  GR: { country: 'Greece', climateZone: 'Mediterranean', avgTempByMonth: { Jan: 10, Feb: 10, Mar: 12, Apr: 16, May: 21, Jun: 26, Jul: 29, Aug: 29, Sep: 25, Oct: 20, Nov: 15, Dec: 11 }, rainySeason: 'November-February', drySeason: 'June-September', avgRainfallMm: 402, humidityRange: '50-75%' },
  CH: { country: 'Switzerland', climateZone: 'Alpine to Continental', avgTempByMonth: { Jan: 0, Feb: 1, Mar: 5, Apr: 9, May: 14, Jun: 17, Jul: 20, Aug: 19, Sep: 15, Oct: 10, Nov: 5, Dec: 1 }, rainySeason: 'June-August (thunderstorms)', drySeason: 'February-April', avgRainfallMm: 1537, humidityRange: '65-85%' },
  VN: { country: 'Vietnam', climateZone: 'Tropical Monsoon', avgTempByMonth: { Jan: 21, Feb: 22, Mar: 24, Apr: 27, May: 29, Jun: 30, Jul: 30, Aug: 29, Sep: 28, Oct: 26, Nov: 24, Dec: 22 }, rainySeason: 'May-November (varies by region)', drySeason: 'December-April', avgRainfallMm: 1821, humidityRange: '70-90%' },
  ID: { country: 'Indonesia', climateZone: 'Tropical', avgTempByMonth: { Jan: 27, Feb: 27, Mar: 27, Apr: 28, May: 28, Jun: 27, Jul: 27, Aug: 27, Sep: 28, Oct: 28, Nov: 28, Dec: 27 }, rainySeason: 'November-March', drySeason: 'April-October', avgRainfallMm: 2702, humidityRange: '70-95%' },
  MY: { country: 'Malaysia', climateZone: 'Tropical Rainforest', avgTempByMonth: { Jan: 27, Feb: 28, Mar: 28, Apr: 28, May: 28, Jun: 28, Jul: 28, Aug: 28, Sep: 27, Oct: 27, Nov: 27, Dec: 27 }, rainySeason: 'November-February (west), May-November (east)', drySeason: 'March-October (west)', avgRainfallMm: 2875, humidityRange: '75-95%' },
  PH: { country: 'Philippines', climateZone: 'Tropical Maritime', avgTempByMonth: { Jan: 26, Feb: 27, Mar: 28, Apr: 29, May: 29, Jun: 28, Jul: 28, Aug: 27, Sep: 27, Oct: 27, Nov: 27, Dec: 26 }, rainySeason: 'June-November (typhoon season)', drySeason: 'December-May', avgRainfallMm: 2348, humidityRange: '70-90%' },
  NL: { country: 'Netherlands', climateZone: 'Temperate Maritime', avgTempByMonth: { Jan: 3, Feb: 4, Mar: 7, Apr: 10, May: 14, Jun: 17, Jul: 19, Aug: 19, Sep: 16, Oct: 12, Nov: 7, Dec: 4 }, rainySeason: 'October-December', drySeason: 'April-June', avgRainfallMm: 838, humidityRange: '75-90%' },
  SE: { country: 'Sweden', climateZone: 'Continental to Subarctic', avgTempByMonth: { Jan: -3, Feb: -3, Mar: 1, Apr: 6, May: 12, Jun: 16, Jul: 18, Aug: 17, Sep: 12, Oct: 7, Nov: 2, Dec: -1 }, rainySeason: 'July-September', drySeason: 'February-May', avgRainfallMm: 539, humidityRange: '65-85%' },
  NO: { country: 'Norway', climateZone: 'Temperate Maritime to Arctic', avgTempByMonth: { Jan: -4, Feb: -4, Mar: 0, Apr: 5, May: 11, Jun: 15, Jul: 17, Aug: 16, Sep: 11, Oct: 6, Nov: 1, Dec: -3 }, rainySeason: 'September-November', drySeason: 'May-July', avgRainfallMm: 1414, humidityRange: '70-85%' },
  AT: { country: 'Austria', climateZone: 'Continental to Alpine', avgTempByMonth: { Jan: -1, Feb: 1, Mar: 6, Apr: 11, May: 16, Jun: 19, Jul: 21, Aug: 21, Sep: 16, Oct: 10, Nov: 4, Dec: 0 }, rainySeason: 'May-August', drySeason: 'October-March', avgRainfallMm: 1100, humidityRange: '65-80%' },
  SA: { country: 'Saudi Arabia', climateZone: 'Hot Desert', avgTempByMonth: { Jan: 15, Feb: 17, Mar: 21, Apr: 27, May: 33, Jun: 36, Jul: 38, Aug: 38, Sep: 35, Oct: 29, Nov: 22, Dec: 17 }, rainySeason: 'November-April (minimal)', drySeason: 'Year-round', avgRainfallMm: 59, humidityRange: '20-60%' },
  LK: { country: 'Sri Lanka', climateZone: 'Tropical', avgTempByMonth: { Jan: 27, Feb: 28, Mar: 29, Apr: 29, May: 28, Jun: 28, Jul: 27, Aug: 27, Sep: 27, Oct: 27, Nov: 27, Dec: 27 }, rainySeason: 'May-September (southwest), October-January (northeast)', drySeason: 'January-April (southwest), May-September (northeast)', avgRainfallMm: 1861, humidityRange: '70-90%' },
  BT: { country: 'Bhutan', climateZone: 'Subtropical to Alpine', avgTempByMonth: { Jan: 8, Feb: 10, Mar: 14, Apr: 18, May: 21, Jun: 23, Jul: 24, Aug: 24, Sep: 22, Oct: 18, Nov: 13, Dec: 9 }, rainySeason: 'June-September (monsoon)', drySeason: 'October-May', avgRainfallMm: 1000, humidityRange: '50-90%' },
  MM: { country: 'Myanmar', climateZone: 'Tropical Monsoon', avgTempByMonth: { Jan: 25, Feb: 27, Mar: 30, Apr: 32, May: 30, Jun: 28, Jul: 27, Aug: 27, Sep: 28, Oct: 28, Nov: 27, Dec: 25 }, rainySeason: 'May-October (monsoon)', drySeason: 'November-April', avgRainfallMm: 2365, humidityRange: '60-95%' },
};
