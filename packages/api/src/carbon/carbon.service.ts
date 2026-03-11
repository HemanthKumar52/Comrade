import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// CO2 emission factors in kg per km
const EMISSION_FACTORS: Record<string, number> = {
  car: 0.21,
  electric_car: 0.05,
  bike: 0.103,
  bus: 0.089,
  train: 0.041,
  flight_short: 0.255,
  flight_long: 0.195,
  trek: 0,
  bicycle: 0,
  auto: 0.15,
  ferry: 0.19,
  metro: 0.033,
};

// Friendly display names for vehicles
const VEHICLE_LABELS: Record<string, string> = {
  car: 'Car (Petrol/Diesel)',
  electric_car: 'Electric Car',
  bike: 'Motorbike',
  bus: 'Bus',
  train: 'Train',
  flight_short: 'Flight (Short-haul <1500km)',
  flight_long: 'Flight (Long-haul >1500km)',
  trek: 'Trekking / Walking',
  bicycle: 'Bicycle',
  auto: 'Auto Rickshaw',
  ferry: 'Ferry / Boat',
  metro: 'Metro / Subway',
};

// 1 tree absorbs ~22 kg CO2 per year
const CO2_PER_TREE_PER_YEAR = 22;
const COST_PER_TREE_USD = 0.5;

@Injectable()
export class CarbonService {
  constructor(private prisma: PrismaService) {}

  async calculateTripCarbon(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    const vehicleType = (trip.vehicleType || 'car').toLowerCase();
    const distanceKm = trip.distanceKm || 0;

    // Determine if flight is short or long haul
    let emissionKey = vehicleType;
    if (vehicleType === 'flight') {
      emissionKey = distanceKm > 1500 ? 'flight_long' : 'flight_short';
    }

    const factor = EMISSION_FACTORS[emissionKey] ?? EMISSION_FACTORS['car'];
    const totalCO2 = parseFloat((factor * distanceKm).toFixed(2));

    return {
      tripId,
      vehicleType,
      vehicleLabel: VEHICLE_LABELS[emissionKey] || vehicleType,
      distanceKm,
      emissionFactorKgPerKm: factor,
      totalCO2Kg: totalCO2,
      equivalentTreeMonths: parseFloat(((totalCO2 / CO2_PER_TREE_PER_YEAR) * 12).toFixed(1)),
      rating: this.getCarbonRating(factor),
      tips: this.getTipsForVehicle(emissionKey),
    };
  }

  async getUserLifetimeCarbon(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: { userId, status: 'COMPLETED' },
    });

    let totalCO2 = 0;
    const breakdownByVehicle: Record<string, { trips: number; km: number; co2: number }> = {};

    for (const trip of trips) {
      const vehicleType = (trip.vehicleType || 'car').toLowerCase();
      const distanceKm = trip.distanceKm || 0;
      let emissionKey = vehicleType;
      if (vehicleType === 'flight') {
        emissionKey = distanceKm > 1500 ? 'flight_long' : 'flight_short';
      }

      const factor = EMISSION_FACTORS[emissionKey] ?? EMISSION_FACTORS['car'];
      const co2 = factor * distanceKm;
      totalCO2 += co2;

      if (!breakdownByVehicle[emissionKey]) {
        breakdownByVehicle[emissionKey] = { trips: 0, km: 0, co2: 0 };
      }
      breakdownByVehicle[emissionKey].trips += 1;
      breakdownByVehicle[emissionKey].km += distanceKm;
      breakdownByVehicle[emissionKey].co2 += co2;
    }

    const totalKm = trips.reduce((sum, t) => sum + (t.distanceKm || 0), 0);

    return {
      userId,
      totalTrips: trips.length,
      totalDistanceKm: parseFloat(totalKm.toFixed(1)),
      totalCO2Kg: parseFloat(totalCO2.toFixed(2)),
      averageCO2PerKm: totalKm > 0 ? parseFloat((totalCO2 / totalKm).toFixed(4)) : 0,
      treesNeededToOffset: Math.ceil(totalCO2 / CO2_PER_TREE_PER_YEAR),
      estimatedOffsetCost: parseFloat((Math.ceil(totalCO2 / CO2_PER_TREE_PER_YEAR) * COST_PER_TREE_USD).toFixed(2)),
      breakdownByVehicle: Object.entries(breakdownByVehicle).map(([key, val]) => ({
        vehicle: key,
        label: VEHICLE_LABELS[key] || key,
        trips: val.trips,
        distanceKm: parseFloat(val.km.toFixed(1)),
        co2Kg: parseFloat(val.co2.toFixed(2)),
      })),
      carbonRating: this.getOverallCarbonRating(totalCO2, totalKm),
    };
  }

  compareVehicles(vehicle1: string, vehicle2: string, distance: number) {
    const factor1 = EMISSION_FACTORS[vehicle1];
    const factor2 = EMISSION_FACTORS[vehicle2];

    if (factor1 === undefined) throw new NotFoundException(`Unknown vehicle type: ${vehicle1}`);
    if (factor2 === undefined) throw new NotFoundException(`Unknown vehicle type: ${vehicle2}`);

    const co2_1 = parseFloat((factor1 * distance).toFixed(2));
    const co2_2 = parseFloat((factor2 * distance).toFixed(2));
    const savings = parseFloat(Math.abs(co2_1 - co2_2).toFixed(2));
    const winner = co2_1 <= co2_2 ? vehicle1 : vehicle2;

    return {
      distance,
      vehicle1: {
        type: vehicle1,
        label: VEHICLE_LABELS[vehicle1] || vehicle1,
        emissionFactor: factor1,
        totalCO2Kg: co2_1,
        treesNeeded: Math.ceil(co2_1 / CO2_PER_TREE_PER_YEAR),
      },
      vehicle2: {
        type: vehicle2,
        label: VEHICLE_LABELS[vehicle2] || vehicle2,
        emissionFactor: factor2,
        totalCO2Kg: co2_2,
        treesNeeded: Math.ceil(co2_2 / CO2_PER_TREE_PER_YEAR),
      },
      savings: {
        co2SavedKg: savings,
        percentSaved: co2_1 + co2_2 > 0 ? parseFloat(((savings / Math.max(co2_1, co2_2)) * 100).toFixed(1)) : 0,
        greenerOption: winner,
        greenerLabel: VEHICLE_LABELS[winner] || winner,
      },
      allVehicles: Object.entries(EMISSION_FACTORS).map(([key, factor]) => ({
        type: key,
        label: VEHICLE_LABELS[key] || key,
        co2Kg: parseFloat((factor * distance).toFixed(2)),
      })).sort((a, b) => a.co2Kg - b.co2Kg),
    };
  }

  async getOffsetRecommendations(tripId: string) {
    const carbonData = await this.calculateTripCarbon(tripId);
    const treesNeeded = Math.ceil(carbonData.totalCO2Kg / CO2_PER_TREE_PER_YEAR);
    const costEstimate = parseFloat((treesNeeded * COST_PER_TREE_USD).toFixed(2));

    return {
      tripId,
      totalCO2Kg: carbonData.totalCO2Kg,
      offsetOptions: [
        {
          method: 'Tree Planting',
          description: `Plant ${treesNeeded} native trees to absorb ${carbonData.totalCO2Kg} kg CO2 over one year`,
          treesRequired: treesNeeded,
          estimatedCostUSD: costEstimate,
          timeToOffset: '1 year',
          partnerNGOs: [
            { name: 'Sankalp Taru Foundation', url: 'https://www.sankalptaru.org' },
            { name: 'Grow Trees', url: 'https://www.growtrees.com' },
            { name: 'One Tree Planted', url: 'https://onetreeplanted.org' },
          ],
        },
        {
          method: 'Renewable Energy Credits',
          description: `Purchase ${Math.ceil(carbonData.totalCO2Kg / 1000)} MWh of renewable energy credits`,
          estimatedCostUSD: parseFloat((Math.ceil(carbonData.totalCO2Kg / 1000) * 15).toFixed(2)),
          timeToOffset: 'Immediate',
        },
        {
          method: 'Clean Cookstove Support',
          description: 'Fund clean cooking solutions in developing regions',
          estimatedCostUSD: parseFloat((carbonData.totalCO2Kg * 0.02).toFixed(2)),
          timeToOffset: 'Ongoing',
        },
      ],
      alternatives: this.getSuggestedAlternatives(carbonData.vehicleType, carbonData.distanceKm),
    };
  }

  async getGreenLeaderboard() {
    const users = await this.prisma.user.findMany({
      where: { totalKm: { gt: 100 } },
      select: {
        id: true,
        name: true,
        avatar: true,
        totalKm: true,
        totalTrips: true,
      },
      orderBy: { totalKm: 'desc' },
      take: 50,
    });

    const leaderboard = [];

    for (const user of users) {
      const trips = await this.prisma.trip.findMany({
        where: { userId: user.id, status: 'COMPLETED' },
        select: { vehicleType: true, distanceKm: true },
      });

      let totalCO2 = 0;
      for (const trip of trips) {
        const vehicleType = (trip.vehicleType || 'car').toLowerCase();
        const distanceKm = trip.distanceKm || 0;
        let emissionKey = vehicleType;
        if (vehicleType === 'flight') {
          emissionKey = distanceKm > 1500 ? 'flight_long' : 'flight_short';
        }
        const factor = EMISSION_FACTORS[emissionKey] ?? EMISSION_FACTORS['car'];
        totalCO2 += factor * distanceKm;
      }

      const co2PerKm = user.totalKm > 0 ? totalCO2 / user.totalKm : 0;

      leaderboard.push({
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        totalKm: user.totalKm,
        totalTrips: user.totalTrips,
        totalCO2Kg: parseFloat(totalCO2.toFixed(2)),
        co2PerKm: parseFloat(co2PerKm.toFixed(4)),
        rating: this.getOverallCarbonRating(totalCO2, user.totalKm),
      });
    }

    leaderboard.sort((a, b) => a.co2PerKm - b.co2PerKm);

    return {
      leaderboard: leaderboard.slice(0, 20).map((entry, index) => ({
        rank: index + 1,
        ...entry,
      })),
      totalParticipants: leaderboard.length,
    };
  }

  private getCarbonRating(factorPerKm: number): string {
    if (factorPerKm === 0) return 'ZERO_EMISSION';
    if (factorPerKm <= 0.05) return 'EXCELLENT';
    if (factorPerKm <= 0.1) return 'GOOD';
    if (factorPerKm <= 0.15) return 'MODERATE';
    if (factorPerKm <= 0.21) return 'HIGH';
    return 'VERY_HIGH';
  }

  private getOverallCarbonRating(totalCO2: number, totalKm: number): string {
    if (totalKm === 0) return 'NO_DATA';
    const avg = totalCO2 / totalKm;
    return this.getCarbonRating(avg);
  }

  private getTipsForVehicle(vehicleType: string): string[] {
    const tips: Record<string, string[]> = {
      car: [
        'Consider carpooling to split emissions between passengers',
        'Maintain optimal tire pressure to improve fuel efficiency by 3%',
        'Use cruise control on highways to reduce fuel consumption',
        'Switch to an electric or hybrid vehicle for up to 75% less emissions',
      ],
      bike: [
        'Regular servicing keeps your engine efficient and reduces emissions',
        'Ride at steady speeds; aggressive acceleration increases fuel use by 33%',
        'Consider an electric scooter for short urban commutes',
      ],
      flight_short: [
        'Consider taking a train for distances under 500 km - up to 84% less CO2',
        'Choose economy class - business class has 3x the carbon footprint',
        'Fly direct; takeoffs and landings consume the most fuel',
        'Choose airlines with newer, fuel-efficient aircraft',
      ],
      flight_long: [
        'Choose economy class to reduce your per-seat emissions',
        'Fly direct to avoid extra takeoff/landing cycles',
        'Offset your flight carbon through verified programs',
        'Pack light - every kilogram adds to fuel consumption',
      ],
      bus: [
        'Great choice! Buses are one of the most efficient motorized transport options',
        'Choose electric or CNG buses when available for even lower emissions',
      ],
      train: [
        'Excellent choice! Trains are among the lowest-emission transport modes',
        'Electric trains produce up to 80% less CO2 than diesel trains',
      ],
      auto: [
        'Share your auto with co-passengers headed the same direction',
        'Consider switching to CNG autos for lower emissions',
      ],
      ferry: [
        'Choose modern ferries with hybrid or LNG propulsion when possible',
        'High-speed ferries use more fuel per km than conventional ones',
      ],
      metro: [
        'Outstanding choice! Metro systems are the greenest motorized urban transport',
        'Combining metro with walking or cycling is the most eco-friendly commute',
      ],
    };

    return tips[vehicleType] || [
      'Choose lower-emission transport options when possible',
      'Combine multiple errands into single trips to reduce total emissions',
    ];
  }

  private getSuggestedAlternatives(vehicleType: string, distanceKm: number): Array<{ vehicle: string; label: string; co2Kg: number; savingsPercent: number }> {
    const currentFactor = EMISSION_FACTORS[vehicleType] ?? EMISSION_FACTORS['car'];
    const currentCO2 = currentFactor * distanceKm;

    return Object.entries(EMISSION_FACTORS)
      .filter(([key]) => key !== vehicleType)
      .map(([key, factor]) => ({
        vehicle: key,
        label: VEHICLE_LABELS[key] || key,
        co2Kg: parseFloat((factor * distanceKm).toFixed(2)),
        savingsPercent: currentCO2 > 0 ? parseFloat((((currentCO2 - factor * distanceKm) / currentCO2) * 100).toFixed(1)) : 0,
      }))
      .filter((alt) => alt.savingsPercent > 0)
      .sort((a, b) => b.savingsPercent - a.savingsPercent);
  }
}
