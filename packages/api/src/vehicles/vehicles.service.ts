import { Injectable } from '@nestjs/common';
import { VEHICLE_RENTAL_PROVIDERS, VehicleType } from '../data/vehicle-rentals';

@Injectable()
export class VehiclesService {
  getRentalsByCountry(country: string) {
    const code = country.toUpperCase();
    const providers = VEHICLE_RENTAL_PROVIDERS.filter(
      (p) => p.country === code || p.country === 'GLOBAL',
    );
    return {
      country: code,
      totalProviders: providers.length,
      providers,
    };
  }

  getRentalsByType(type: string, country?: string) {
    const vehicleType = type.toLowerCase() as VehicleType;
    let providers = VEHICLE_RENTAL_PROVIDERS.filter((p) =>
      p.types.includes(vehicleType),
    );

    if (country) {
      const code = country.toUpperCase();
      providers = providers.filter(
        (p) => p.country === code || p.country === 'GLOBAL',
      );
    }

    return {
      type: vehicleType,
      country: country?.toUpperCase() || 'ALL',
      totalProviders: providers.length,
      providers,
    };
  }

  getEstimatedPrice(country: string, type: string, days: number) {
    const code = country.toUpperCase();
    const vehicleType = type.toLowerCase() as VehicleType;

    const providers = VEHICLE_RENTAL_PROVIDERS.filter(
      (p) =>
        (p.country === code || p.country === 'GLOBAL') &&
        p.types.includes(vehicleType),
    );

    if (providers.length === 0) {
      return {
        country: code,
        type: vehicleType,
        days,
        message: `No ${vehicleType} providers found for ${code}`,
      };
    }

    const estimates = providers.map((p) => {
      const minTotal = p.priceRange.perDay
        ? p.priceRange.min * days
        : p.priceRange.min * days; // per-ride estimate
      const maxTotal = p.priceRange.perDay
        ? p.priceRange.max * days
        : p.priceRange.max * days;

      return {
        provider: p.name,
        currency: p.priceRange.currency,
        perDay: { min: p.priceRange.min, max: p.priceRange.max },
        totalEstimate: { min: minTotal, max: maxTotal },
        rating: p.rating,
      };
    });

    const allMin = Math.min(...estimates.map((e) => e.totalEstimate.min));
    const allMax = Math.max(...estimates.map((e) => e.totalEstimate.max));
    const currency = estimates[0]?.currency || 'USD';

    return {
      country: code,
      type: vehicleType,
      days,
      currency,
      cheapestEstimate: allMin,
      highestEstimate: allMax,
      averagePerDay: Math.round(
        estimates.reduce((s, e) => s + (e.perDay.min + e.perDay.max) / 2, 0) /
          estimates.length,
      ),
      providers: estimates,
    };
  }

  getAllProviders() {
    const byCountry: Record<string, number> = {};
    for (const p of VEHICLE_RENTAL_PROVIDERS) {
      byCountry[p.country] = (byCountry[p.country] || 0) + 1;
    }

    return {
      totalProviders: VEHICLE_RENTAL_PROVIDERS.length,
      countriesServed: Object.keys(byCountry).length,
      providersByCountry: byCountry,
      providers: VEHICLE_RENTAL_PROVIDERS,
    };
  }

  getVehicleTypes(country?: string) {
    let providers = VEHICLE_RENTAL_PROVIDERS;
    if (country) {
      const code = country.toUpperCase();
      providers = providers.filter(
        (p) => p.country === code || p.country === 'GLOBAL',
      );
    }

    const types = [...new Set(providers.flatMap((p) => p.types))].sort();
    return {
      country: country?.toUpperCase() || 'ALL',
      availableTypes: types,
      typeCount: types.length,
    };
  }
}
