export interface ClimateData {
  zone: string;
  bestMonths: number[];
  worstMonths: number[];
  monsoonMonths?: number[];
  avgTemp: Record<number, { high: number; low: number }>;
  rainfall: Record<number, number>;
  humidity: string;
  typhoonSeason?: string;
  snowMonths?: number[];
  description: string;
}

export const CLIMATE_DATA: Record<string, ClimateData> = {
  IN: {
    zone: 'tropical/subtropical', bestMonths: [10, 11, 12, 1, 2, 3], worstMonths: [6, 7, 8],
    monsoonMonths: [6, 7, 8, 9],
    avgTemp: { 1: { high: 25, low: 12 }, 2: { high: 28, low: 15 }, 3: { high: 33, low: 20 }, 4: { high: 38, low: 25 }, 5: { high: 41, low: 28 }, 6: { high: 38, low: 28 }, 7: { high: 35, low: 27 }, 8: { high: 34, low: 26 }, 9: { high: 34, low: 25 }, 10: { high: 33, low: 22 }, 11: { high: 29, low: 16 }, 12: { high: 25, low: 12 } },
    rainfall: { 1: 15, 2: 10, 3: 10, 4: 12, 5: 25, 6: 150, 7: 250, 8: 230, 9: 150, 10: 40, 11: 10, 12: 8 },
    humidity: 'high', description: 'Diverse climate. North has distinct seasons, South is tropical year-round. Monsoon June-September brings heavy rain.',
  },
  US: {
    zone: 'varied', bestMonths: [4, 5, 6, 9, 10], worstMonths: [1, 2],
    avgTemp: { 1: { high: 5, low: -3 }, 2: { high: 7, low: -1 }, 3: { high: 13, low: 4 }, 4: { high: 19, low: 9 }, 5: { high: 24, low: 14 }, 6: { high: 29, low: 19 }, 7: { high: 32, low: 22 }, 8: { high: 31, low: 21 }, 9: { high: 27, low: 17 }, 10: { high: 20, low: 10 }, 11: { high: 13, low: 5 }, 12: { high: 7, low: 0 } },
    rainfall: { 1: 80, 2: 75, 3: 100, 4: 100, 5: 110, 6: 95, 7: 105, 8: 100, 9: 95, 10: 85, 11: 90, 12: 85 },
    humidity: 'moderate', description: 'Varies enormously: humid subtropical in Southeast, arid in Southwest, continental in Midwest, oceanic in Pacific Northwest.',
  },
  JP: {
    zone: 'temperate', bestMonths: [3, 4, 5, 10, 11], worstMonths: [6, 7, 8],
    avgTemp: { 1: { high: 10, low: 2 }, 2: { high: 10, low: 2 }, 3: { high: 14, low: 5 }, 4: { high: 19, low: 10 }, 5: { high: 23, low: 15 }, 6: { high: 26, low: 19 }, 7: { high: 30, low: 23 }, 8: { high: 31, low: 24 }, 9: { high: 27, low: 21 }, 10: { high: 22, low: 15 }, 11: { high: 17, low: 9 }, 12: { high: 12, low: 4 } },
    rainfall: { 1: 50, 2: 55, 3: 115, 4: 130, 5: 140, 6: 165, 7: 155, 8: 165, 9: 210, 10: 165, 11: 95, 12: 55 },
    humidity: 'high', typhoonSeason: 'August-October', snowMonths: [12, 1, 2, 3], description: 'Cherry blossom season (March-April) is magical. Rainy season (tsuyu) in June. Hot humid summers. Beautiful autumn colors October-November.',
  },
  GB: {
    zone: 'oceanic', bestMonths: [5, 6, 7, 8, 9], worstMonths: [11, 12, 1, 2],
    avgTemp: { 1: { high: 8, low: 2 }, 2: { high: 8, low: 2 }, 3: { high: 11, low: 3 }, 4: { high: 13, low: 5 }, 5: { high: 17, low: 8 }, 6: { high: 20, low: 11 }, 7: { high: 22, low: 13 }, 8: { high: 22, low: 13 }, 9: { high: 19, low: 11 }, 10: { high: 15, low: 8 }, 11: { high: 11, low: 5 }, 12: { high: 8, low: 3 } },
    rainfall: { 1: 55, 2: 40, 3: 40, 4: 45, 5: 50, 6: 45, 7: 45, 8: 50, 9: 50, 10: 60, 11: 65, 12: 55 },
    humidity: 'high', description: 'Mild but unpredictable. Rain possible any day. Summers pleasant. Long daylight hours June-July.',
  },
  TH: {
    zone: 'tropical', bestMonths: [11, 12, 1, 2, 3], worstMonths: [5, 6, 7, 8, 9],
    monsoonMonths: [5, 6, 7, 8, 9, 10],
    avgTemp: { 1: { high: 32, low: 21 }, 2: { high: 33, low: 23 }, 3: { high: 35, low: 25 }, 4: { high: 36, low: 26 }, 5: { high: 34, low: 25 }, 6: { high: 33, low: 25 }, 7: { high: 33, low: 25 }, 8: { high: 33, low: 25 }, 9: { high: 32, low: 24 }, 10: { high: 32, low: 24 }, 11: { high: 32, low: 23 }, 12: { high: 31, low: 21 } },
    rainfall: { 1: 10, 2: 25, 3: 30, 4: 65, 5: 160, 6: 150, 7: 155, 8: 175, 9: 250, 10: 240, 11: 55, 12: 5 },
    humidity: 'high', description: 'Hot and humid year-round. Cool season Nov-Feb is most pleasant. Avoid monsoon unless seeking budget deals.',
  },
  FR: {
    zone: 'temperate oceanic', bestMonths: [5, 6, 7, 9, 10], worstMonths: [1, 2, 11],
    avgTemp: { 1: { high: 7, low: 2 }, 2: { high: 8, low: 2 }, 3: { high: 12, low: 5 }, 4: { high: 15, low: 7 }, 5: { high: 19, low: 11 }, 6: { high: 23, low: 14 }, 7: { high: 25, low: 16 }, 8: { high: 25, low: 16 }, 9: { high: 21, low: 13 }, 10: { high: 16, low: 9 }, 11: { high: 11, low: 5 }, 12: { high: 7, low: 3 } },
    rainfall: { 1: 50, 2: 40, 3: 45, 4: 50, 5: 60, 6: 50, 7: 55, 8: 45, 9: 50, 10: 55, 11: 50, 12: 55 },
    humidity: 'moderate', description: 'Mediterranean climate in south (hot dry summers). Oceanic in north/west. Paris best in spring and early fall.',
  },
  DE: {
    zone: 'temperate continental', bestMonths: [5, 6, 7, 8, 9], worstMonths: [11, 12, 1, 2],
    avgTemp: { 1: { high: 3, low: -2 }, 2: { high: 5, low: -1 }, 3: { high: 9, low: 2 }, 4: { high: 14, low: 5 }, 5: { high: 19, low: 9 }, 6: { high: 22, low: 12 }, 7: { high: 24, low: 14 }, 8: { high: 24, low: 14 }, 9: { high: 19, low: 10 }, 10: { high: 14, low: 6 }, 11: { high: 8, low: 3 }, 12: { high: 4, low: 0 } },
    rainfall: { 1: 40, 2: 35, 3: 40, 4: 40, 5: 55, 6: 65, 7: 60, 8: 60, 9: 45, 10: 40, 11: 45, 12: 45 },
    humidity: 'moderate', snowMonths: [12, 1, 2, 3], description: 'Warm summers, cold winters. Christmas markets Nov-Dec. Oktoberfest September-October. Alps snowy December-March.',
  },
  AU: {
    zone: 'varied', bestMonths: [3, 4, 5, 9, 10, 11], worstMonths: [12, 1, 2],
    avgTemp: { 1: { high: 29, low: 20 }, 2: { high: 28, low: 20 }, 3: { high: 27, low: 18 }, 4: { high: 23, low: 15 }, 5: { high: 20, low: 12 }, 6: { high: 17, low: 9 }, 7: { high: 17, low: 8 }, 8: { high: 18, low: 9 }, 9: { high: 21, low: 11 }, 10: { high: 23, low: 14 }, 11: { high: 25, low: 16 }, 12: { high: 27, low: 18 } },
    rainfall: { 1: 100, 2: 110, 3: 120, 4: 115, 5: 115, 6: 130, 7: 95, 8: 75, 9: 60, 10: 75, 11: 80, 12: 80 },
    humidity: 'moderate', description: 'Seasons reversed from Northern Hemisphere. Summer (Dec-Feb) very hot. Tropical north has wet/dry seasons.',
  },
  IT: {
    zone: 'mediterranean', bestMonths: [4, 5, 6, 9, 10], worstMonths: [1, 2, 11, 12],
    avgTemp: { 1: { high: 12, low: 3 }, 2: { high: 13, low: 4 }, 3: { high: 16, low: 6 }, 4: { high: 19, low: 9 }, 5: { high: 24, low: 13 }, 6: { high: 28, low: 17 }, 7: { high: 31, low: 20 }, 8: { high: 31, low: 20 }, 9: { high: 27, low: 16 }, 10: { high: 22, low: 12 }, 11: { high: 16, low: 7 }, 12: { high: 12, low: 4 } },
    rainfall: { 1: 65, 2: 60, 3: 55, 4: 65, 5: 45, 6: 30, 7: 15, 8: 25, 9: 60, 10: 95, 11: 105, 12: 80 },
    humidity: 'moderate', description: 'Hot dry summers in south, milder in north. Spring and early fall ideal for sightseeing without extreme heat.',
  },
  ES: {
    zone: 'mediterranean', bestMonths: [4, 5, 6, 9, 10], worstMonths: [7, 8, 12, 1],
    avgTemp: { 1: { high: 11, low: 3 }, 2: { high: 13, low: 4 }, 3: { high: 16, low: 6 }, 4: { high: 19, low: 8 }, 5: { high: 23, low: 12 }, 6: { high: 29, low: 17 }, 7: { high: 33, low: 20 }, 8: { high: 33, low: 20 }, 9: { high: 28, low: 17 }, 10: { high: 22, low: 12 }, 11: { high: 15, low: 7 }, 12: { high: 11, low: 4 } },
    rainfall: { 1: 35, 2: 30, 3: 25, 4: 45, 5: 40, 6: 20, 7: 10, 8: 10, 9: 30, 10: 55, 11: 55, 12: 50 },
    humidity: 'low', description: 'Hot dry summers, mild winters. Southern Spain extremely hot July-August. Northern coast cooler and wetter.',
  },
  AE: {
    zone: 'arid desert', bestMonths: [11, 12, 1, 2, 3], worstMonths: [6, 7, 8, 9],
    avgTemp: { 1: { high: 24, low: 14 }, 2: { high: 25, low: 15 }, 3: { high: 28, low: 18 }, 4: { high: 33, low: 21 }, 5: { high: 38, low: 25 }, 6: { high: 41, low: 28 }, 7: { high: 42, low: 30 }, 8: { high: 42, low: 31 }, 9: { high: 39, low: 27 }, 10: { high: 35, low: 23 }, 11: { high: 30, low: 19 }, 12: { high: 26, low: 16 } },
    rainfall: { 1: 10, 2: 25, 3: 20, 4: 5, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 2, 12: 10 },
    humidity: 'low', description: 'Extremely hot May-September (40°C+). Pleasant winter months ideal for visiting. Indoor attractions year-round.',
  },
  BR: {
    zone: 'tropical', bestMonths: [5, 6, 7, 8, 9], worstMonths: [1, 2, 3],
    avgTemp: { 1: { high: 30, low: 23 }, 2: { high: 30, low: 23 }, 3: { high: 29, low: 23 }, 4: { high: 27, low: 21 }, 5: { high: 25, low: 19 }, 6: { high: 24, low: 18 }, 7: { high: 24, low: 17 }, 8: { high: 25, low: 18 }, 9: { high: 25, low: 19 }, 10: { high: 26, low: 20 }, 11: { high: 28, low: 21 }, 12: { high: 29, low: 22 } },
    rainfall: { 1: 130, 2: 120, 3: 130, 4: 100, 5: 70, 6: 40, 7: 40, 8: 40, 9: 50, 10: 80, 11: 100, 12: 130 },
    humidity: 'high', description: 'Tropical in north, temperate in south. Carnival in February. Dry season May-September ideal for most regions.',
  },
  EG: {
    zone: 'arid desert', bestMonths: [10, 11, 12, 1, 2, 3], worstMonths: [6, 7, 8],
    avgTemp: { 1: { high: 19, low: 9 }, 2: { high: 21, low: 10 }, 3: { high: 24, low: 12 }, 4: { high: 29, low: 15 }, 5: { high: 33, low: 19 }, 6: { high: 36, low: 22 }, 7: { high: 36, low: 23 }, 8: { high: 36, low: 23 }, 9: { high: 33, low: 21 }, 10: { high: 30, low: 18 }, 11: { high: 25, low: 14 }, 12: { high: 21, low: 10 } },
    rainfall: { 1: 5, 2: 4, 3: 3, 4: 1, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 1, 11: 3, 12: 5 },
    humidity: 'low', description: 'Very hot summers. Winter mild and perfect for sightseeing pyramids and temples. Almost no rain.',
  },
  ZA: {
    zone: 'subtropical', bestMonths: [3, 4, 5, 9, 10, 11], worstMonths: [6, 7],
    avgTemp: { 1: { high: 28, low: 16 }, 2: { high: 28, low: 16 }, 3: { high: 26, low: 15 }, 4: { high: 23, low: 11 }, 5: { high: 20, low: 8 }, 6: { high: 18, low: 5 }, 7: { high: 18, low: 5 }, 8: { high: 20, low: 7 }, 9: { high: 23, low: 10 }, 10: { high: 25, low: 12 }, 11: { high: 26, low: 14 }, 12: { high: 27, low: 15 } },
    rainfall: { 1: 110, 2: 90, 3: 80, 4: 50, 5: 15, 6: 8, 7: 5, 8: 10, 9: 25, 10: 60, 11: 85, 12: 100 },
    humidity: 'moderate', description: 'Seasons reversed. Dry winter best for safari (animals gather at water sources). Cape Town Mediterranean climate.',
  },
  SG: {
    zone: 'tropical equatorial', bestMonths: [2, 3, 4, 5, 6, 7], worstMonths: [11, 12, 1],
    avgTemp: { 1: { high: 30, low: 24 }, 2: { high: 31, low: 24 }, 3: { high: 32, low: 24 }, 4: { high: 32, low: 25 }, 5: { high: 32, low: 25 }, 6: { high: 31, low: 25 }, 7: { high: 31, low: 25 }, 8: { high: 31, low: 25 }, 9: { high: 31, low: 24 }, 10: { high: 31, low: 24 }, 11: { high: 31, low: 24 }, 12: { high: 30, low: 24 } },
    rainfall: { 1: 230, 2: 150, 3: 170, 4: 165, 5: 170, 6: 130, 7: 145, 8: 145, 9: 165, 10: 190, 11: 250, 12: 270 },
    humidity: 'high', description: 'Hot and humid year-round. Northeast monsoon Nov-Jan brings heaviest rain. Brief afternoon thunderstorms common.',
  },
  NZ: {
    zone: 'temperate oceanic', bestMonths: [12, 1, 2, 3], worstMonths: [6, 7, 8],
    avgTemp: { 1: { high: 24, low: 15 }, 2: { high: 24, low: 15 }, 3: { high: 22, low: 14 }, 4: { high: 19, low: 11 }, 5: { high: 16, low: 9 }, 6: { high: 14, low: 7 }, 7: { high: 13, low: 6 }, 8: { high: 14, low: 7 }, 9: { high: 16, low: 8 }, 10: { high: 18, low: 10 }, 11: { high: 20, low: 12 }, 12: { high: 22, low: 14 } },
    rainfall: { 1: 75, 2: 80, 3: 80, 4: 90, 5: 100, 6: 110, 7: 110, 8: 100, 9: 90, 10: 85, 11: 80, 12: 80 },
    humidity: 'moderate', snowMonths: [6, 7, 8, 9], description: 'Seasons reversed. Summer Dec-Feb warm and sunny. Great skiing in winter. Four seasons in one day possible.',
  },
  MX: {
    zone: 'tropical/arid', bestMonths: [11, 12, 1, 2, 3, 4], worstMonths: [6, 7, 8, 9],
    avgTemp: { 1: { high: 22, low: 6 }, 2: { high: 24, low: 8 }, 3: { high: 27, low: 10 }, 4: { high: 29, low: 12 }, 5: { high: 30, low: 14 }, 6: { high: 27, low: 15 }, 7: { high: 25, low: 13 }, 8: { high: 25, low: 13 }, 9: { high: 24, low: 13 }, 10: { high: 24, low: 11 }, 11: { high: 23, low: 8 }, 12: { high: 22, low: 6 } },
    rainfall: { 1: 10, 2: 5, 3: 5, 4: 15, 5: 40, 6: 135, 7: 155, 8: 150, 9: 130, 10: 55, 11: 10, 12: 5 },
    humidity: 'moderate', description: 'Dry season Nov-April ideal. Hurricane season Jun-Nov on coasts. Central highlands mild year-round.',
  },
  KR: {
    zone: 'temperate continental', bestMonths: [4, 5, 9, 10], worstMonths: [7, 8, 1, 2],
    avgTemp: { 1: { high: 1, low: -6 }, 2: { high: 4, low: -4 }, 3: { high: 11, low: 2 }, 4: { high: 18, low: 8 }, 5: { high: 23, low: 13 }, 6: { high: 27, low: 18 }, 7: { high: 29, low: 22 }, 8: { high: 30, low: 23 }, 9: { high: 26, low: 17 }, 10: { high: 20, low: 10 }, 11: { high: 12, low: 3 }, 12: { high: 4, low: -3 } },
    rainfall: { 1: 20, 2: 25, 3: 45, 4: 65, 5: 85, 6: 130, 7: 375, 8: 295, 9: 135, 10: 50, 11: 45, 12: 20 },
    humidity: 'moderate', snowMonths: [12, 1, 2], description: 'Cherry blossom spring (April). Hot humid monsoon summer. Stunning fall foliage October. Cold snowy winters.',
  },
  TR: {
    zone: 'mediterranean/continental', bestMonths: [4, 5, 6, 9, 10], worstMonths: [1, 2, 7, 8],
    avgTemp: { 1: { high: 9, low: 3 }, 2: { high: 10, low: 3 }, 3: { high: 13, low: 5 }, 4: { high: 17, low: 9 }, 5: { high: 22, low: 13 }, 6: { high: 27, low: 17 }, 7: { high: 30, low: 20 }, 8: { high: 30, low: 20 }, 9: { high: 26, low: 17 }, 10: { high: 21, low: 13 }, 11: { high: 15, low: 8 }, 12: { high: 10, low: 5 } },
    rainfall: { 1: 70, 2: 55, 3: 50, 4: 40, 5: 25, 6: 15, 7: 8, 8: 8, 9: 15, 10: 45, 11: 60, 12: 75 },
    humidity: 'moderate', description: 'Istanbul lovely in spring/fall. Mediterranean coast hot dry summer. Eastern Turkey cold winters with snow.',
  },
};

export function getBestTimeToVisit(countryCode: string): { bestMonths: string[]; description: string; avoid: string[] } {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = CLIMATE_DATA[countryCode];
  if (!data) return { bestMonths: ['Any time'], description: 'Climate data not available for this destination.', avoid: [] };
  return {
    bestMonths: data.bestMonths.map(m => monthNames[m - 1]),
    description: data.description,
    avoid: data.worstMonths.map(m => monthNames[m - 1]),
  };
}

export function getMonthlyForecast(countryCode: string, month: number): { high: number; low: number; rainfall: number; recommendation: string } | null {
  const data = CLIMATE_DATA[countryCode];
  if (!data || !data.avgTemp[month]) return null;
  const temp = data.avgTemp[month];
  const rain = data.rainfall[month] || 0;
  let recommendation = 'Good time to visit.';
  if (data.bestMonths.includes(month)) recommendation = 'Excellent time to visit!';
  if (data.worstMonths.includes(month)) recommendation = 'Not ideal. Consider visiting in ' + data.bestMonths.slice(0, 3).map(m => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]).join(', ') + '.';
  if (data.monsoonMonths?.includes(month)) recommendation += ' Monsoon season - expect heavy rain.';
  return { high: temp.high, low: temp.low, rainfall: rain, recommendation };
}
