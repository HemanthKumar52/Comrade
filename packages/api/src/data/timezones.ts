export interface TimezoneData {
  timezone: string;
  utcOffset: number; // hours
  abbreviation: string;
  dst: boolean;
}

export const TIMEZONE_DATA: Record<string, TimezoneData[]> = {
  IN: [{ timezone: 'Asia/Kolkata', utcOffset: 5.5, abbreviation: 'IST', dst: false }],
  US: [
    { timezone: 'America/New_York', utcOffset: -5, abbreviation: 'EST', dst: true },
    { timezone: 'America/Chicago', utcOffset: -6, abbreviation: 'CST', dst: true },
    { timezone: 'America/Denver', utcOffset: -7, abbreviation: 'MST', dst: true },
    { timezone: 'America/Los_Angeles', utcOffset: -8, abbreviation: 'PST', dst: true },
    { timezone: 'America/Anchorage', utcOffset: -9, abbreviation: 'AKST', dst: true },
    { timezone: 'Pacific/Honolulu', utcOffset: -10, abbreviation: 'HST', dst: false },
  ],
  GB: [{ timezone: 'Europe/London', utcOffset: 0, abbreviation: 'GMT', dst: true }],
  JP: [{ timezone: 'Asia/Tokyo', utcOffset: 9, abbreviation: 'JST', dst: false }],
  FR: [{ timezone: 'Europe/Paris', utcOffset: 1, abbreviation: 'CET', dst: true }],
  DE: [{ timezone: 'Europe/Berlin', utcOffset: 1, abbreviation: 'CET', dst: true }],
  AU: [
    { timezone: 'Australia/Sydney', utcOffset: 11, abbreviation: 'AEDT', dst: true },
    { timezone: 'Australia/Brisbane', utcOffset: 10, abbreviation: 'AEST', dst: false },
    { timezone: 'Australia/Adelaide', utcOffset: 10.5, abbreviation: 'ACDT', dst: true },
    { timezone: 'Australia/Perth', utcOffset: 8, abbreviation: 'AWST', dst: false },
  ],
  CN: [{ timezone: 'Asia/Shanghai', utcOffset: 8, abbreviation: 'CST', dst: false }],
  SG: [{ timezone: 'Asia/Singapore', utcOffset: 8, abbreviation: 'SGT', dst: false }],
  TH: [{ timezone: 'Asia/Bangkok', utcOffset: 7, abbreviation: 'ICT', dst: false }],
  KR: [{ timezone: 'Asia/Seoul', utcOffset: 9, abbreviation: 'KST', dst: false }],
  IT: [{ timezone: 'Europe/Rome', utcOffset: 1, abbreviation: 'CET', dst: true }],
  ES: [{ timezone: 'Europe/Madrid', utcOffset: 1, abbreviation: 'CET', dst: true }],
  BR: [
    { timezone: 'America/Sao_Paulo', utcOffset: -3, abbreviation: 'BRT', dst: false },
    { timezone: 'America/Manaus', utcOffset: -4, abbreviation: 'AMT', dst: false },
  ],
  AE: [{ timezone: 'Asia/Dubai', utcOffset: 4, abbreviation: 'GST', dst: false }],
  SA: [{ timezone: 'Asia/Riyadh', utcOffset: 3, abbreviation: 'AST', dst: false }],
  NZ: [{ timezone: 'Pacific/Auckland', utcOffset: 13, abbreviation: 'NZDT', dst: true }],
  CA: [
    { timezone: 'America/Toronto', utcOffset: -5, abbreviation: 'EST', dst: true },
    { timezone: 'America/Vancouver', utcOffset: -8, abbreviation: 'PST', dst: true },
    { timezone: 'America/Edmonton', utcOffset: -7, abbreviation: 'MST', dst: true },
  ],
  MX: [
    { timezone: 'America/Mexico_City', utcOffset: -6, abbreviation: 'CST', dst: true },
    { timezone: 'America/Tijuana', utcOffset: -8, abbreviation: 'PST', dst: true },
  ],
  TR: [{ timezone: 'Europe/Istanbul', utcOffset: 3, abbreviation: 'TRT', dst: false }],
  NP: [{ timezone: 'Asia/Kathmandu', utcOffset: 5.75, abbreviation: 'NPT', dst: false }],
  LK: [{ timezone: 'Asia/Colombo', utcOffset: 5.5, abbreviation: 'SLST', dst: false }],
  VN: [{ timezone: 'Asia/Ho_Chi_Minh', utcOffset: 7, abbreviation: 'ICT', dst: false }],
  ID: [
    { timezone: 'Asia/Jakarta', utcOffset: 7, abbreviation: 'WIB', dst: false },
    { timezone: 'Asia/Makassar', utcOffset: 8, abbreviation: 'WITA', dst: false },
    { timezone: 'Asia/Jayapura', utcOffset: 9, abbreviation: 'WIT', dst: false },
  ],
  MY: [{ timezone: 'Asia/Kuala_Lumpur', utcOffset: 8, abbreviation: 'MYT', dst: false }],
  PH: [{ timezone: 'Asia/Manila', utcOffset: 8, abbreviation: 'PHT', dst: false }],
  EG: [{ timezone: 'Africa/Cairo', utcOffset: 2, abbreviation: 'EET', dst: false }],
  ZA: [{ timezone: 'Africa/Johannesburg', utcOffset: 2, abbreviation: 'SAST', dst: false }],
  KE: [{ timezone: 'Africa/Nairobi', utcOffset: 3, abbreviation: 'EAT', dst: false }],
  RU: [
    { timezone: 'Europe/Moscow', utcOffset: 3, abbreviation: 'MSK', dst: false },
    { timezone: 'Asia/Vladivostok', utcOffset: 10, abbreviation: 'VLAT', dst: false },
  ],
  PT: [{ timezone: 'Europe/Lisbon', utcOffset: 0, abbreviation: 'WET', dst: true }],
  GR: [{ timezone: 'Europe/Athens', utcOffset: 2, abbreviation: 'EET', dst: true }],
  CH: [{ timezone: 'Europe/Zurich', utcOffset: 1, abbreviation: 'CET', dst: true }],
  NL: [{ timezone: 'Europe/Amsterdam', utcOffset: 1, abbreviation: 'CET', dst: true }],
  SE: [{ timezone: 'Europe/Stockholm', utcOffset: 1, abbreviation: 'CET', dst: true }],
  NO: [{ timezone: 'Europe/Oslo', utcOffset: 1, abbreviation: 'CET', dst: true }],
  AT: [{ timezone: 'Europe/Vienna', utcOffset: 1, abbreviation: 'CET', dst: true }],
  BT: [{ timezone: 'Asia/Thimphu', utcOffset: 6, abbreviation: 'BTT', dst: false }],
};

/**
 * Simplified solar position calculation.
 * Returns sunrise, sunset, and golden hour times in hours (UTC).
 */
export function calculateSunTimes(lat: number, lng: number, date: Date): {
  sunrise: number;
  sunset: number;
  solarNoon: number;
  goldenHourStart: number;
  goldenHourEnd: number;
  dayLengthHours: number;
} {
  const dayOfYear = getDayOfYear(date);
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
  const latRad = (lat * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;

  const cosHourAngle = -Math.tan(latRad) * Math.tan(declRad);
  // Clamp to [-1, 1] for polar regions
  const clampedCos = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngle = Math.acos(clampedCos) * (180 / Math.PI);

  const solarNoon = 12 - lng / 15;
  const sunriseHour = solarNoon - hourAngle / 15;
  const sunsetHour = solarNoon + hourAngle / 15;
  const goldenHourStart = sunsetHour - 1;
  const goldenHourEnd = sunsetHour;

  return {
    sunrise: sunriseHour,
    sunset: sunsetHour,
    solarNoon,
    goldenHourStart,
    goldenHourEnd,
    dayLengthHours: Math.round((sunsetHour - sunriseHour) * 100) / 100,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function hoursToTimeString(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
