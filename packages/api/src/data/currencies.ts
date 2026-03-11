export interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  country?: string;
}

export const CURRENCIES: CurrencyData[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, country: 'US' },
  { code: 'EUR', name: 'Euro', symbol: '\u20ac', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '\u00a3', decimals: 2, country: 'GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00a5', decimals: 0, country: 'JP' },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20b9', decimals: 2, country: 'IN' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2, country: 'AU' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2, country: 'CA' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2, country: 'CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '\u00a5', decimals: 2, country: 'CN' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2, country: 'SE' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2, country: 'NZ' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2, country: 'MX' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2, country: 'SG' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimals: 2, country: 'NO' },
  { code: 'KRW', name: 'South Korean Won', symbol: '\u20a9', decimals: 0, country: 'KR' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '\u20ba', decimals: 2, country: 'TR' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '\u20bd', decimals: 2, country: 'RU' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2, country: 'BR' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2, country: 'ZA' },
  { code: 'THB', name: 'Thai Baht', symbol: '\u0e3f', decimals: 2, country: 'TH' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', decimals: 0 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimals: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'z\u0142', decimals: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '\u20b1', decimals: 2, country: 'PH' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0, country: 'ID' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'K\u010d', decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', decimals: 2, country: 'AE' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', decimals: 2, country: 'SA' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2, country: 'MY' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', decimals: 0 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', decimals: 0 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E\u00a3', decimals: 2, country: 'EG' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', decimals: 0 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', decimals: 2 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '\u20aa', decimals: 2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '\u20ab', decimals: 0, country: 'VN' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '\u20a8', decimals: 2 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '\u09f3', decimals: 2 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', decimals: 2, country: 'LK' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '\u20a6', decimals: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', decimals: 2, country: 'KE' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', decimals: 2 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', decimals: 3 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', decimals: 3 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', decimals: 3 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', decimals: 3 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.', decimals: 2 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '\u20b4', decimals: 2 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', decimals: 2 },
  { code: 'NPR', name: 'Nepali Rupee', symbol: '\u20a8', decimals: 2, country: 'NP' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', decimals: 0, country: 'MM' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.', decimals: 2, country: 'BT' },
];

export interface CommonPriceData {
  mealCheap: number;
  mealMidRange: number;
  mealFine: number;
  coffee: number;
  beer: number;
  water: number;
  localTransport: number;
  taxi1km: number;
  hostel: number;
  midHotel: number;
  currency: string;
  lastUpdated: string;
}

export const COMMON_PRICES: Record<string, CommonPriceData> = {
  IN: { mealCheap: 150, mealMidRange: 600, mealFine: 2500, coffee: 150, beer: 200, water: 20, localTransport: 30, taxi1km: 15, hostel: 500, midHotel: 3000, currency: 'INR', lastUpdated: '2025-12' },
  US: { mealCheap: 15, mealMidRange: 40, mealFine: 120, coffee: 5, beer: 7, water: 2, localTransport: 2.75, taxi1km: 2.5, hostel: 40, midHotel: 150, currency: 'USD', lastUpdated: '2025-12' },
  GB: { mealCheap: 10, mealMidRange: 30, mealFine: 80, coffee: 3.5, beer: 6, water: 1, localTransport: 2.8, taxi1km: 3, hostel: 25, midHotel: 120, currency: 'GBP', lastUpdated: '2025-12' },
  JP: { mealCheap: 800, mealMidRange: 2500, mealFine: 10000, coffee: 400, beer: 500, water: 110, localTransport: 200, taxi1km: 420, hostel: 3000, midHotel: 12000, currency: 'JPY', lastUpdated: '2025-12' },
  TH: { mealCheap: 60, mealMidRange: 300, mealFine: 1500, coffee: 60, beer: 60, water: 10, localTransport: 20, taxi1km: 7, hostel: 300, midHotel: 1500, currency: 'THB', lastUpdated: '2025-12' },
  SG: { mealCheap: 5, mealMidRange: 25, mealFine: 100, coffee: 5, beer: 12, water: 1.5, localTransport: 2, taxi1km: 3.5, hostel: 25, midHotel: 200, currency: 'SGD', lastUpdated: '2025-12' },
  FR: { mealCheap: 12, mealMidRange: 30, mealFine: 100, coffee: 3, beer: 6, water: 1.5, localTransport: 2.15, taxi1km: 2.5, hostel: 30, midHotel: 120, currency: 'EUR', lastUpdated: '2025-12' },
  DE: { mealCheap: 10, mealMidRange: 25, mealFine: 80, coffee: 3.5, beer: 4, water: 1, localTransport: 3.2, taxi1km: 2.5, hostel: 25, midHotel: 100, currency: 'EUR', lastUpdated: '2025-12' },
  AE: { mealCheap: 25, mealMidRange: 80, mealFine: 300, coffee: 18, beer: 45, water: 1.5, localTransport: 4, taxi1km: 3, hostel: 80, midHotel: 400, currency: 'AED', lastUpdated: '2025-12' },
  AU: { mealCheap: 18, mealMidRange: 40, mealFine: 120, coffee: 5, beer: 10, water: 2.5, localTransport: 4.6, taxi1km: 3.5, hostel: 35, midHotel: 180, currency: 'AUD', lastUpdated: '2025-12' },
  KR: { mealCheap: 7000, mealMidRange: 15000, mealFine: 60000, coffee: 5000, beer: 4000, water: 1000, localTransport: 1400, taxi1km: 1000, hostel: 25000, midHotel: 100000, currency: 'KRW', lastUpdated: '2025-12' },
  BR: { mealCheap: 25, mealMidRange: 60, mealFine: 200, coffee: 8, beer: 10, water: 3, localTransport: 5, taxi1km: 4, hostel: 50, midHotel: 250, currency: 'BRL', lastUpdated: '2025-12' },
  NP: { mealCheap: 200, mealMidRange: 600, mealFine: 2000, coffee: 150, beer: 350, water: 25, localTransport: 25, taxi1km: 30, hostel: 500, midHotel: 3000, currency: 'NPR', lastUpdated: '2025-12' },
  VN: { mealCheap: 40000, mealMidRange: 150000, mealFine: 500000, coffee: 25000, beer: 15000, water: 5000, localTransport: 7000, taxi1km: 12000, hostel: 150000, midHotel: 800000, currency: 'VND', lastUpdated: '2025-12' },
  TR: { mealCheap: 100, mealMidRange: 300, mealFine: 1000, coffee: 50, beer: 80, water: 5, localTransport: 15, taxi1km: 15, hostel: 300, midHotel: 1500, currency: 'TRY', lastUpdated: '2025-12' },
  EG: { mealCheap: 80, mealMidRange: 300, mealFine: 1000, coffee: 40, beer: 80, water: 5, localTransport: 10, taxi1km: 10, hostel: 200, midHotel: 1500, currency: 'EGP', lastUpdated: '2025-12' },
  MX: { mealCheap: 80, mealMidRange: 250, mealFine: 800, coffee: 50, beer: 35, water: 15, localTransport: 7, taxi1km: 15, hostel: 250, midHotel: 1500, currency: 'MXN', lastUpdated: '2025-12' },
  ID: { mealCheap: 25000, mealMidRange: 80000, mealFine: 300000, coffee: 25000, beer: 35000, water: 5000, localTransport: 5000, taxi1km: 7500, hostel: 100000, midHotel: 500000, currency: 'IDR', lastUpdated: '2025-12' },
};

/**
 * Lookup currency code for a given country code.
 */
export function getCurrencyForCountry(countryCode: string): CurrencyData | undefined {
  return CURRENCIES.find((c) => c.country === countryCode.toUpperCase());
}
