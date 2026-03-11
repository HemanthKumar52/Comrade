export interface CountryData {
  code: string;
  name: string;
  capital: string;
  currency: string;
  currencySymbol: string;
  language: string[];
  callingCode: string;
  drivingSide: 'left' | 'right';
  continent: string;
  region: string;
  flagEmoji: string;
  lat: number;
  lng: number;
}

export const COUNTRIES: Record<string, CountryData> = {
  IN: { code: 'IN', name: 'India', capital: 'New Delhi', currency: 'INR', currencySymbol: '\u20b9', language: ['Hindi', 'English'], callingCode: '+91', drivingSide: 'left', continent: 'Asia', region: 'South Asia', flagEmoji: '\ud83c\uddee\ud83c\uddf3', lat: 20.5937, lng: 78.9629 },
  US: { code: 'US', name: 'United States', capital: 'Washington, D.C.', currency: 'USD', currencySymbol: '$', language: ['English'], callingCode: '+1', drivingSide: 'right', continent: 'North America', region: 'North America', flagEmoji: '\ud83c\uddfa\ud83c\uddf8', lat: 37.0902, lng: -95.7129 },
  GB: { code: 'GB', name: 'United Kingdom', capital: 'London', currency: 'GBP', currencySymbol: '\u00a3', language: ['English'], callingCode: '+44', drivingSide: 'left', continent: 'Europe', region: 'Western Europe', flagEmoji: '\ud83c\uddec\ud83c\udde7', lat: 55.3781, lng: -3.436 },
  JP: { code: 'JP', name: 'Japan', capital: 'Tokyo', currency: 'JPY', currencySymbol: '\u00a5', language: ['Japanese'], callingCode: '+81', drivingSide: 'left', continent: 'Asia', region: 'East Asia', flagEmoji: '\ud83c\uddef\ud83c\uddf5', lat: 36.2048, lng: 138.2529 },
  FR: { code: 'FR', name: 'France', capital: 'Paris', currency: 'EUR', currencySymbol: '\u20ac', language: ['French'], callingCode: '+33', drivingSide: 'right', continent: 'Europe', region: 'Western Europe', flagEmoji: '\ud83c\uddeb\ud83c\uddf7', lat: 46.2276, lng: 2.2137 },
  DE: { code: 'DE', name: 'Germany', capital: 'Berlin', currency: 'EUR', currencySymbol: '\u20ac', language: ['German'], callingCode: '+49', drivingSide: 'right', continent: 'Europe', region: 'Central Europe', flagEmoji: '\ud83c\udde9\ud83c\uddea', lat: 51.1657, lng: 10.4515 },
  AU: { code: 'AU', name: 'Australia', capital: 'Canberra', currency: 'AUD', currencySymbol: 'A$', language: ['English'], callingCode: '+61', drivingSide: 'left', continent: 'Oceania', region: 'Oceania', flagEmoji: '\ud83c\udde6\ud83c\uddfa', lat: -25.2744, lng: 133.7751 },
  CN: { code: 'CN', name: 'China', capital: 'Beijing', currency: 'CNY', currencySymbol: '\u00a5', language: ['Mandarin'], callingCode: '+86', drivingSide: 'right', continent: 'Asia', region: 'East Asia', flagEmoji: '\ud83c\udde8\ud83c\uddf3', lat: 35.8617, lng: 104.1954 },
  SG: { code: 'SG', name: 'Singapore', capital: 'Singapore', currency: 'SGD', currencySymbol: 'S$', language: ['English', 'Malay', 'Mandarin', 'Tamil'], callingCode: '+65', drivingSide: 'left', continent: 'Asia', region: 'Southeast Asia', flagEmoji: '\ud83c\uddf8\ud83c\uddec', lat: 1.3521, lng: 103.8198 },
  TH: { code: 'TH', name: 'Thailand', capital: 'Bangkok', currency: 'THB', currencySymbol: '\u0e3f', language: ['Thai'], callingCode: '+66', drivingSide: 'left', continent: 'Asia', region: 'Southeast Asia', flagEmoji: '\ud83c\uddf9\ud83c\udded', lat: 15.87, lng: 100.9925 },
  KR: { code: 'KR', name: 'South Korea', capital: 'Seoul', currency: 'KRW', currencySymbol: '\u20a9', language: ['Korean'], callingCode: '+82', drivingSide: 'right', continent: 'Asia', region: 'East Asia', flagEmoji: '\ud83c\uddf0\ud83c\uddf7', lat: 35.9078, lng: 127.7669 },
  IT: { code: 'IT', name: 'Italy', capital: 'Rome', currency: 'EUR', currencySymbol: '\u20ac', language: ['Italian'], callingCode: '+39', drivingSide: 'right', continent: 'Europe', region: 'Southern Europe', flagEmoji: '\ud83c\uddee\ud83c\uddf9', lat: 41.8719, lng: 12.5674 },
  ES: { code: 'ES', name: 'Spain', capital: 'Madrid', currency: 'EUR', currencySymbol: '\u20ac', language: ['Spanish'], callingCode: '+34', drivingSide: 'right', continent: 'Europe', region: 'Southern Europe', flagEmoji: '\ud83c\uddea\ud83c\uddf8', lat: 40.4637, lng: -3.7492 },
  BR: { code: 'BR', name: 'Brazil', capital: 'Brasilia', currency: 'BRL', currencySymbol: 'R$', language: ['Portuguese'], callingCode: '+55', drivingSide: 'right', continent: 'South America', region: 'South America', flagEmoji: '\ud83c\udde7\ud83c\uddf7', lat: -14.235, lng: -51.9253 },
  AE: { code: 'AE', name: 'United Arab Emirates', capital: 'Abu Dhabi', currency: 'AED', currencySymbol: 'AED', language: ['Arabic', 'English'], callingCode: '+971', drivingSide: 'right', continent: 'Asia', region: 'Middle East', flagEmoji: '\ud83c\udde6\ud83c\uddea', lat: 23.4241, lng: 53.8478 },
  SA: { code: 'SA', name: 'Saudi Arabia', capital: 'Riyadh', currency: 'SAR', currencySymbol: 'SAR', language: ['Arabic'], callingCode: '+966', drivingSide: 'right', continent: 'Asia', region: 'Middle East', flagEmoji: '\ud83c\uddf8\ud83c\udde6', lat: 23.8859, lng: 45.0792 },
  NZ: { code: 'NZ', name: 'New Zealand', capital: 'Wellington', currency: 'NZD', currencySymbol: 'NZ$', language: ['English', 'Maori'], callingCode: '+64', drivingSide: 'left', continent: 'Oceania', region: 'Oceania', flagEmoji: '\ud83c\uddf3\ud83c\uddff', lat: -40.9006, lng: 174.886 },
  CA: { code: 'CA', name: 'Canada', capital: 'Ottawa', currency: 'CAD', currencySymbol: 'C$', language: ['English', 'French'], callingCode: '+1', drivingSide: 'right', continent: 'North America', region: 'North America', flagEmoji: '\ud83c\udde8\ud83c\udde6', lat: 56.1304, lng: -106.3468 },
  MX: { code: 'MX', name: 'Mexico', capital: 'Mexico City', currency: 'MXN', currencySymbol: 'MX$', language: ['Spanish'], callingCode: '+52', drivingSide: 'right', continent: 'North America', region: 'Central America', flagEmoji: '\ud83c\uddf2\ud83c\uddfd', lat: 23.6345, lng: -102.5528 },
  TR: { code: 'TR', name: 'Turkey', capital: 'Ankara', currency: 'TRY', currencySymbol: '\u20ba', language: ['Turkish'], callingCode: '+90', drivingSide: 'right', continent: 'Asia', region: 'Middle East', flagEmoji: '\ud83c\uddf9\ud83c\uddf7', lat: 38.9637, lng: 35.2433 },
  NP: { code: 'NP', name: 'Nepal', capital: 'Kathmandu', currency: 'NPR', currencySymbol: '\u20a8', language: ['Nepali'], callingCode: '+977', drivingSide: 'left', continent: 'Asia', region: 'South Asia', flagEmoji: '\ud83c\uddf3\ud83c\uddf5', lat: 28.3949, lng: 84.124 },
  LK: { code: 'LK', name: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', currency: 'LKR', currencySymbol: 'Rs', language: ['Sinhala', 'Tamil'], callingCode: '+94', drivingSide: 'left', continent: 'Asia', region: 'South Asia', flagEmoji: '\ud83c\uddf1\ud83c\uddf0', lat: 7.8731, lng: 80.7718 },
  VN: { code: 'VN', name: 'Vietnam', capital: 'Hanoi', currency: 'VND', currencySymbol: '\u20ab', language: ['Vietnamese'], callingCode: '+84', drivingSide: 'right', continent: 'Asia', region: 'Southeast Asia', flagEmoji: '\ud83c\uddfb\ud83c\uddf3', lat: 14.0583, lng: 108.2772 },
  ID: { code: 'ID', name: 'Indonesia', capital: 'Jakarta', currency: 'IDR', currencySymbol: 'Rp', language: ['Indonesian'], callingCode: '+62', drivingSide: 'left', continent: 'Asia', region: 'Southeast Asia', flagEmoji: '\ud83c\uddee\ud83c\udde9', lat: -0.7893, lng: 113.9213 },
  MY: { code: 'MY', name: 'Malaysia', capital: 'Kuala Lumpur', currency: 'MYR', currencySymbol: 'RM', language: ['Malay', 'English'], callingCode: '+60', drivingSide: 'left', continent: 'Asia', region: 'Southeast Asia', flagEmoji: '\ud83c\uddf2\ud83c\uddfe', lat: 4.2105, lng: 101.9758 },
  PH: { code: 'PH', name: 'Philippines', capital: 'Manila', currency: 'PHP', currencySymbol: '\u20b1', language: ['Filipino', 'English'], callingCode: '+63', drivingSide: 'right', continent: 'Asia', region: 'Southeast Asia', flagEmoji: '\ud83c\uddf5\ud83c\udded', lat: 12.8797, lng: 121.774 },
  EG: { code: 'EG', name: 'Egypt', capital: 'Cairo', currency: 'EGP', currencySymbol: 'E\u00a3', language: ['Arabic'], callingCode: '+20', drivingSide: 'right', continent: 'Africa', region: 'North Africa', flagEmoji: '\ud83c\uddea\ud83c\uddec', lat: 26.8206, lng: 30.8025 },
  ZA: { code: 'ZA', name: 'South Africa', capital: 'Pretoria', currency: 'ZAR', currencySymbol: 'R', language: ['English', 'Afrikaans', 'Zulu'], callingCode: '+27', drivingSide: 'left', continent: 'Africa', region: 'Southern Africa', flagEmoji: '\ud83c\uddff\ud83c\udde6', lat: -30.5595, lng: 22.9375 },
  KE: { code: 'KE', name: 'Kenya', capital: 'Nairobi', currency: 'KES', currencySymbol: 'KSh', language: ['Swahili', 'English'], callingCode: '+254', drivingSide: 'left', continent: 'Africa', region: 'East Africa', flagEmoji: '\ud83c\uddf0\ud83c\uddea', lat: -0.0236, lng: 37.9062 },
  RU: { code: 'RU', name: 'Russia', capital: 'Moscow', currency: 'RUB', currencySymbol: '\u20bd', language: ['Russian'], callingCode: '+7', drivingSide: 'right', continent: 'Europe', region: 'Eastern Europe', flagEmoji: '\ud83c\uddf7\ud83c\uddfa', lat: 61.524, lng: 105.3188 },
  PT: { code: 'PT', name: 'Portugal', capital: 'Lisbon', currency: 'EUR', currencySymbol: '\u20ac', language: ['Portuguese'], callingCode: '+351', drivingSide: 'right', continent: 'Europe', region: 'Southern Europe', flagEmoji: '\ud83c\uddf5\ud83c\uddf9', lat: 39.3999, lng: -8.2245 },
  GR: { code: 'GR', name: 'Greece', capital: 'Athens', currency: 'EUR', currencySymbol: '\u20ac', language: ['Greek'], callingCode: '+30', drivingSide: 'right', continent: 'Europe', region: 'Southern Europe', flagEmoji: '\ud83c\uddec\ud83c\uddf7', lat: 39.0742, lng: 21.8243 },
  CH: { code: 'CH', name: 'Switzerland', capital: 'Bern', currency: 'CHF', currencySymbol: 'CHF', language: ['German', 'French', 'Italian', 'Romansh'], callingCode: '+41', drivingSide: 'right', continent: 'Europe', region: 'Central Europe', flagEmoji: '\ud83c\udde8\ud83c\udded', lat: 46.8182, lng: 8.2275 },
  NL: { code: 'NL', name: 'Netherlands', capital: 'Amsterdam', currency: 'EUR', currencySymbol: '\u20ac', language: ['Dutch'], callingCode: '+31', drivingSide: 'right', continent: 'Europe', region: 'Western Europe', flagEmoji: '\ud83c\uddf3\ud83c\uddf1', lat: 52.1326, lng: 5.2913 },
  SE: { code: 'SE', name: 'Sweden', capital: 'Stockholm', currency: 'SEK', currencySymbol: 'kr', language: ['Swedish'], callingCode: '+46', drivingSide: 'right', continent: 'Europe', region: 'Northern Europe', flagEmoji: '\ud83c\uddf8\ud83c\uddea', lat: 60.1282, lng: 18.6435 },
  NO: { code: 'NO', name: 'Norway', capital: 'Oslo', currency: 'NOK', currencySymbol: 'kr', language: ['Norwegian'], callingCode: '+47', drivingSide: 'right', continent: 'Europe', region: 'Northern Europe', flagEmoji: '\ud83c\uddf3\ud83c\uddf4', lat: 60.472, lng: 8.4689 },
  AT: { code: 'AT', name: 'Austria', capital: 'Vienna', currency: 'EUR', currencySymbol: '\u20ac', language: ['German'], callingCode: '+43', drivingSide: 'right', continent: 'Europe', region: 'Central Europe', flagEmoji: '\ud83c\udde6\ud83c\uddf9', lat: 47.5162, lng: 14.5501 },
  BT: { code: 'BT', name: 'Bhutan', capital: 'Thimphu', currency: 'BTN', currencySymbol: 'Nu.', language: ['Dzongkha'], callingCode: '+975', drivingSide: 'left', continent: 'Asia', region: 'South Asia', flagEmoji: '\ud83c\udde7\ud83c\uddf9', lat: 27.5142, lng: 90.4336 },
  MM: { code: 'MM', name: 'Myanmar', capital: 'Naypyidaw', currency: 'MMK', currencySymbol: 'K', language: ['Burmese'], callingCode: '+95', drivingSide: 'right', continent: 'Asia', region: 'Southeast Asia', flagEmoji: '\ud83c\uddf2\ud83c\uddf2', lat: 21.9162, lng: 95.956 },
};

export const CITY_TO_COUNTRY: Record<string, string> = {
  'new delhi': 'IN', 'mumbai': 'IN', 'bangalore': 'IN', 'chennai': 'IN', 'kolkata': 'IN', 'hyderabad': 'IN',
  'new york': 'US', 'los angeles': 'US', 'chicago': 'US', 'san francisco': 'US', 'miami': 'US', 'seattle': 'US',
  'london': 'GB', 'manchester': 'GB', 'edinburgh': 'GB', 'birmingham': 'GB',
  'tokyo': 'JP', 'osaka': 'JP', 'kyoto': 'JP', 'yokohama': 'JP',
  'paris': 'FR', 'lyon': 'FR', 'marseille': 'FR', 'nice': 'FR',
  'berlin': 'DE', 'munich': 'DE', 'hamburg': 'DE', 'frankfurt': 'DE',
  'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU', 'perth': 'AU',
  'beijing': 'CN', 'shanghai': 'CN', 'guangzhou': 'CN', 'shenzhen': 'CN',
  'singapore': 'SG',
  'bangkok': 'TH', 'chiang mai': 'TH', 'phuket': 'TH',
  'seoul': 'KR', 'busan': 'KR',
  'rome': 'IT', 'milan': 'IT', 'florence': 'IT', 'venice': 'IT',
  'madrid': 'ES', 'barcelona': 'ES', 'seville': 'ES',
  'sao paulo': 'BR', 'rio de janeiro': 'BR',
  'dubai': 'AE', 'abu dhabi': 'AE',
  'riyadh': 'SA', 'jeddah': 'SA',
  'auckland': 'NZ', 'wellington': 'NZ',
  'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA',
  'mexico city': 'MX', 'cancun': 'MX',
  'istanbul': 'TR', 'ankara': 'TR',
  'kathmandu': 'NP',
  'colombo': 'LK',
  'hanoi': 'VN', 'ho chi minh city': 'VN',
  'jakarta': 'ID', 'bali': 'ID',
  'kuala lumpur': 'MY',
  'manila': 'PH',
  'cairo': 'EG',
  'cape town': 'ZA', 'johannesburg': 'ZA',
  'nairobi': 'KE',
  'moscow': 'RU', 'saint petersburg': 'RU',
  'lisbon': 'PT', 'porto': 'PT',
  'athens': 'GR', 'santorini': 'GR',
  'zurich': 'CH', 'geneva': 'CH',
  'amsterdam': 'NL',
  'stockholm': 'SE',
  'oslo': 'NO',
  'vienna': 'AT',
  'thimphu': 'BT',
};
