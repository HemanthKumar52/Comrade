import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/create-budget.dto';

interface CacheEntry {
  rate: number;
  timestamp: number;
}

@Injectable()
export class CurrencyService {
  private rateCache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly FRANKFURTER_URL = 'https://api.frankfurter.app';

  constructor(private prisma: PrismaService) {}

  async getRate(from: string, to: string): Promise<{ from: string; to: string; rate: number }> {
    const key = `${from}-${to}`;
    const cached = this.rateCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return { from, to, rate: cached.rate };
    }

    try {
      const res = await fetch(
        `${this.FRANKFURTER_URL}/latest?from=${from}&to=${to}`,
      );
      if (!res.ok) {
        throw new Error('Frankfurter API error');
      }
      const data = (await res.json()) as any;
      const rate = data.rates[to];
      this.rateCache.set(key, { rate, timestamp: Date.now() });
      return { from, to, rate };
    } catch {
      throw new HttpException(
        'Exchange rate service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async convert(
    amount: number,
    from: string,
    to: string,
  ): Promise<{ amount: number; from: string; to: string; rate: number; result: number }> {
    const { rate } = await this.getRate(from, to);
    return { amount, from, to, rate, result: Math.round(amount * rate * 100) / 100 };
  }

  getAllCurrencies() {
    return COMMON_CURRENCIES;
  }

  async getHistorical(
    from: string,
    to: string,
    days: number,
  ) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    try {
      const res = await fetch(
        `${this.FRANKFURTER_URL}/${start}..${end}?from=${from}&to=${to}`,
      );
      if (!res.ok) throw new Error('API error');
      const data = (await res.json()) as any;
      return {
        from,
        to,
        startDate: start,
        endDate: end,
        rates: data.rates,
      };
    } catch {
      throw new HttpException(
        'Historical rates service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async createBudget(dto: CreateBudgetDto) {
    return this.prisma.tripBudget.create({
      data: {
        tripId: dto.tripId,
        totalAmount: dto.totalAmount,
        currency: dto.currency,
        categories: dto.categories
          ? {
              create: dto.categories.map((c) => ({
                name: c.name as any,
                allocated: c.allocated,
              })),
            }
          : undefined,
      },
      include: { categories: true },
    });
  }

  async getBudget(tripId: string) {
    const budget = await this.prisma.tripBudget.findFirst({
      where: { tripId },
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found for this trip');
    }
    return budget;
  }

  async updateBudget(id: string, dto: UpdateBudgetDto) {
    const budget = await this.prisma.tripBudget.findUnique({ where: { id } });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (dto.categories) {
      await this.prisma.budgetCategory.deleteMany({
        where: { budgetId: id },
      });
    }

    return this.prisma.tripBudget.update({
      where: { id },
      data: {
        ...(dto.totalAmount !== undefined && { totalAmount: dto.totalAmount }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.categories && {
          categories: {
            create: dto.categories.map((c) => ({
              name: c.name as any,
              allocated: c.allocated,
            })),
          },
        }),
      },
      include: { categories: true },
    });
  }
}

const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '\u20ac' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00a3' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00a5' },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20b9' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '\u00a5' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '\u20a9' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '\u20ba' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '\u20bd' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'THB', name: 'Thai Baht', symbol: '\u0e3f' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'z\u0142' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '\u20b1' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'K\u010d' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E\u00a3' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$' },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '\u20aa' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '\u20ab' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '\u20a8' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '\u09f3' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '\u20a6' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '\u20b4' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
];
