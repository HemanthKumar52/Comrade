'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Bike, Star, ExternalLink, Shield, Smartphone, Globe2,
  XCircle, CheckCircle, Info, Calculator, ArrowRight, ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const countries = [
  { code: 'IN', name: 'India', currency: '₹', drivingSide: 'Left', licenseReq: 'Indian license valid. IDP for some rentals.', speedLimits: { urban: '50 km/h', rural: '80 km/h', highway: '120 km/h' } },
  { code: 'TH', name: 'Thailand', currency: '฿', drivingSide: 'Left', licenseReq: 'IDP required. Home license + IDP.', speedLimits: { urban: '50 km/h', rural: '90 km/h', highway: '120 km/h' } },
  { code: 'JP', name: 'Japan', currency: '¥', drivingSide: 'Left', licenseReq: 'IDP required (Geneva Convention). US licenses need translation.', speedLimits: { urban: '40 km/h', rural: '60 km/h', highway: '100 km/h' } },
  { code: 'FR', name: 'France', currency: '€', drivingSide: 'Right', licenseReq: 'EU license valid. Others need IDP.', speedLimits: { urban: '50 km/h', rural: '80 km/h', highway: '130 km/h' } },
  { code: 'US', name: 'USA', currency: '$', drivingSide: 'Right', licenseReq: 'Home license valid (varies by state). IDP recommended.', speedLimits: { urban: '25-35 mph', rural: '55 mph', highway: '65-85 mph' } },
  { code: 'GB', name: 'UK', currency: '£', drivingSide: 'Left', licenseReq: 'EU/EEA license valid 12 months. Others need IDP.', speedLimits: { urban: '30 mph', rural: '60 mph', highway: '70 mph' } },
  { code: 'DE', name: 'Germany', currency: '€', drivingSide: 'Right', licenseReq: 'EU license valid. Others need IDP + translation.', speedLimits: { urban: '50 km/h', rural: '100 km/h', highway: 'No limit (advisory 130 km/h)' } },
  { code: 'AE', name: 'UAE', currency: 'AED', drivingSide: 'Right', licenseReq: 'IDP required for tourists. Min age 21.', speedLimits: { urban: '60 km/h', rural: '100 km/h', highway: '140 km/h' } },
  { code: 'AU', name: 'Australia', currency: 'A$', drivingSide: 'Left', licenseReq: 'Home license + IDP valid 3 months.', speedLimits: { urban: '50 km/h', rural: '100 km/h', highway: '110 km/h' } },
  { code: 'ID', name: 'Indonesia', currency: 'Rp', drivingSide: 'Left', licenseReq: 'IDP required. Indonesian license for long stays.', speedLimits: { urban: '50 km/h', rural: '80 km/h', highway: '100 km/h' } },
];

const vehicleTypes = ['Car', 'Bike', 'Scooter', 'Bicycle', 'SUV', 'RV'] as const;

interface Provider {
  id: string;
  name: string;
  vehicleTypes: string[];
  priceRange: 'Budget' | 'Mid' | 'Premium';
  rating: number;
  features: { freeCancel: boolean; insurance: boolean; app: boolean; international: boolean };
  minAge: number;
  website: string;
  countries: string[];
}

const mockProviders: Provider[] = [
  { id: '1', name: 'Hertz', vehicleTypes: ['Car', 'SUV', 'RV'], priceRange: 'Premium', rating: 4.2, features: { freeCancel: true, insurance: true, app: true, international: true }, minAge: 21, website: 'https://hertz.com', countries: ['US', 'GB', 'FR', 'DE', 'AU', 'AE'] },
  { id: '2', name: 'Avis', vehicleTypes: ['Car', 'SUV'], priceRange: 'Premium', rating: 4.1, features: { freeCancel: true, insurance: true, app: true, international: true }, minAge: 21, website: 'https://avis.com', countries: ['US', 'GB', 'FR', 'DE', 'AU', 'AE'] },
  { id: '3', name: 'Enterprise', vehicleTypes: ['Car', 'SUV', 'RV'], priceRange: 'Mid', rating: 4.4, features: { freeCancel: true, insurance: true, app: true, international: true }, minAge: 21, website: 'https://enterprise.com', countries: ['US', 'GB', 'FR', 'DE', 'AU'] },
  { id: '4', name: 'Europcar', vehicleTypes: ['Car', 'SUV'], priceRange: 'Mid', rating: 4.0, features: { freeCancel: true, insurance: true, app: true, international: true }, minAge: 21, website: 'https://europcar.com', countries: ['FR', 'DE', 'GB', 'AU', 'AE'] },
  { id: '5', name: 'Sixt', vehicleTypes: ['Car', 'SUV', 'RV'], priceRange: 'Premium', rating: 4.3, features: { freeCancel: false, insurance: true, app: true, international: true }, minAge: 21, website: 'https://sixt.com', countries: ['DE', 'FR', 'GB', 'US', 'AE'] },
  { id: '6', name: 'Zoomcar', vehicleTypes: ['Car', 'SUV'], priceRange: 'Budget', rating: 3.9, features: { freeCancel: true, insurance: true, app: true, international: false }, minAge: 21, website: 'https://zoomcar.com', countries: ['IN', 'ID'] },
  { id: '7', name: 'Royal Brothers', vehicleTypes: ['Bike', 'Scooter'], priceRange: 'Budget', rating: 4.1, features: { freeCancel: true, insurance: true, app: true, international: false }, minAge: 18, website: 'https://royalbrothers.com', countries: ['IN'] },
  { id: '8', name: 'Budget', vehicleTypes: ['Car', 'SUV'], priceRange: 'Budget', rating: 3.8, features: { freeCancel: true, insurance: true, app: true, international: true }, minAge: 21, website: 'https://budget.com', countries: ['US', 'GB', 'FR', 'AU', 'AE'] },
  { id: '9', name: 'Turo', vehicleTypes: ['Car', 'SUV', 'RV'], priceRange: 'Mid', rating: 4.5, features: { freeCancel: false, insurance: true, app: true, international: false }, minAge: 18, website: 'https://turo.com', countries: ['US', 'GB', 'AU'] },
  { id: '10', name: 'Getaround', vehicleTypes: ['Car', 'SUV'], priceRange: 'Budget', rating: 4.0, features: { freeCancel: true, insurance: true, app: true, international: false }, minAge: 18, website: 'https://getaround.com', countries: ['US', 'FR', 'DE'] },
  { id: '11', name: 'DriveZy', vehicleTypes: ['Car', 'Bike', 'Scooter'], priceRange: 'Budget', rating: 3.7, features: { freeCancel: true, insurance: false, app: true, international: false }, minAge: 18, website: 'https://drivezy.com', countries: ['IN'] },
  { id: '12', name: 'Bounce', vehicleTypes: ['Bike', 'Scooter', 'Bicycle'], priceRange: 'Budget', rating: 4.0, features: { freeCancel: true, insurance: false, app: true, international: false }, minAge: 18, website: 'https://bounceshare.com', countries: ['IN', 'ID'] },
];

const priceEstimates: Record<string, Record<string, { min: number; max: number }>> = {
  IN: { Car: { min: 800, max: 3500 }, Bike: { min: 300, max: 1200 }, Scooter: { min: 200, max: 800 }, Bicycle: { min: 50, max: 300 }, SUV: { min: 1500, max: 5000 }, RV: { min: 5000, max: 15000 } },
  TH: { Car: { min: 600, max: 3000 }, Bike: { min: 200, max: 900 }, Scooter: { min: 150, max: 600 }, Bicycle: { min: 50, max: 200 }, SUV: { min: 1200, max: 5000 }, RV: { min: 4000, max: 12000 } },
  JP: { Car: { min: 3000, max: 12000 }, Bike: { min: 1500, max: 5000 }, Scooter: { min: 800, max: 3000 }, Bicycle: { min: 200, max: 800 }, SUV: { min: 5000, max: 18000 }, RV: { min: 8000, max: 25000 } },
  FR: { Car: { min: 2500, max: 10000 }, Bike: { min: 1000, max: 4000 }, Scooter: { min: 600, max: 2500 }, Bicycle: { min: 200, max: 700 }, SUV: { min: 4000, max: 15000 }, RV: { min: 7000, max: 22000 } },
  US: { Car: { min: 2000, max: 8000 }, Bike: { min: 800, max: 3500 }, Scooter: { min: 500, max: 2000 }, Bicycle: { min: 150, max: 600 }, SUV: { min: 3500, max: 12000 }, RV: { min: 6000, max: 20000 } },
  GB: { Car: { min: 2500, max: 9000 }, Bike: { min: 900, max: 3500 }, Scooter: { min: 500, max: 2000 }, Bicycle: { min: 150, max: 600 }, SUV: { min: 4000, max: 14000 }, RV: { min: 7000, max: 20000 } },
  DE: { Car: { min: 2000, max: 9000 }, Bike: { min: 800, max: 3500 }, Scooter: { min: 500, max: 2000 }, Bicycle: { min: 150, max: 500 }, SUV: { min: 3500, max: 13000 }, RV: { min: 6000, max: 20000 } },
  AE: { Car: { min: 3000, max: 15000 }, Bike: { min: 1000, max: 4000 }, Scooter: { min: 600, max: 2500 }, Bicycle: { min: 200, max: 700 }, SUV: { min: 5000, max: 20000 }, RV: { min: 10000, max: 30000 } },
  AU: { Car: { min: 2500, max: 10000 }, Bike: { min: 1000, max: 4000 }, Scooter: { min: 600, max: 2500 }, Bicycle: { min: 150, max: 600 }, SUV: { min: 4000, max: 15000 }, RV: { min: 7000, max: 22000 } },
  ID: { Car: { min: 500, max: 2500 }, Bike: { min: 150, max: 700 }, Scooter: { min: 100, max: 500 }, Bicycle: { min: 30, max: 200 }, SUV: { min: 1000, max: 4000 }, RV: { min: 3000, max: 10000 } },
};

const priceBadgeColor: Record<string, string> = {
  Budget: 'bg-green-100 text-green-700 border-green-200',
  Mid: 'bg-blue-100 text-blue-700 border-blue-200',
  Premium: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function VehiclesPage() {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [estDays, setEstDays] = useState(3);
  const [estVehicle, setEstVehicle] = useState<string>('Car');

  const country = countries.find((c) => c.code === selectedCountry)!;

  const filteredProviders = useMemo(() => {
    return mockProviders.filter((p) => {
      const inCountry = p.countries.includes(selectedCountry);
      const matchesType = !selectedType || p.vehicleTypes.includes(selectedType);
      return inCountry && matchesType;
    });
  }, [selectedCountry, selectedType]);

  const estimate = priceEstimates[selectedCountry]?.[estVehicle];
  const estimateMin = estimate ? estimate.min * estDays : 0;
  const estimateMax = estimate ? estimate.max * estDays : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
            )}
          />
        ))}
        <span className="text-xs font-semibold text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E]">Vehicle Rentals</h1>
        <p className="text-gray-500 text-sm mt-1">Find the best rental options worldwide</p>
      </motion.div>

      {/* Country Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full sm:w-72 h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </motion.div>

      {/* Vehicle Type Filter Pills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      >
        <button
          onClick={() => setSelectedType(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
            !selectedType ? 'bg-[#1A3C5E] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          )}
        >
          All Types
        </button>
        {vehicleTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
              selectedType === type ? 'bg-[#E8733A] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            )}
          >
            {type}
          </button>
        ))}
      </motion.div>

      {/* Provider Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCountry}-${selectedType}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredProviders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No providers found for this combination</p>
              <p className="text-gray-400 text-sm">Try a different country or vehicle type</p>
            </div>
          ) : (
            filteredProviders.map((provider, i) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all h-full">
                  <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-[#1A3C5E] text-lg">{provider.name}</h3>
                        <p className="text-xs text-gray-400">Min age: {provider.minAge}+</p>
                      </div>
                      <Badge className={cn('text-xs border', priceBadgeColor[provider.priceRange])}>
                        {provider.priceRange}
                      </Badge>
                    </div>

                    {/* Vehicle type badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {provider.vehicleTypes.map((vt) => (
                        <span key={vt} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {vt}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="mb-3">{renderStars(provider.rating)}</div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-1.5 mb-4 text-xs">
                      <span className={cn('flex items-center gap-1', provider.features.freeCancel ? 'text-green-600' : 'text-gray-400')}>
                        {provider.features.freeCancel ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        Free Cancel
                      </span>
                      <span className={cn('flex items-center gap-1', provider.features.insurance ? 'text-green-600' : 'text-gray-400')}>
                        {provider.features.insurance ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        Insurance
                      </span>
                      <span className={cn('flex items-center gap-1', provider.features.app ? 'text-green-600' : 'text-gray-400')}>
                        {provider.features.app ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        App
                      </span>
                      <span className={cn('flex items-center gap-1', provider.features.international ? 'text-green-600' : 'text-gray-400')}>
                        {provider.features.international ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        International
                      </span>
                    </div>

                    <div className="mt-auto">
                      <Button
                        className="w-full bg-[#E8733A] hover:bg-[#d4642e] text-white gap-2"
                        onClick={() => window.open(provider.website, '_blank')}
                      >
                        Visit Website <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Price Estimator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#E8733A]" />
              Price Estimator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Vehicle Type</label>
                <select
                  value={estVehicle}
                  onChange={(e) => setEstVehicle(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                >
                  {vehicleTypes.map((vt) => (
                    <option key={vt} value={vt}>{vt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Days</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={estDays}
                  onChange={(e) => setEstDays(Math.max(1, Number(e.target.value)))}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                />
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#1A3C5E] to-[#2a5a8a] rounded-xl p-5 text-white text-center">
              <p className="text-sm opacity-80 mb-1">Estimated Price Range ({estDays} days)</p>
              <p className="text-3xl sm:text-4xl font-bold">
                {country.currency}{estimateMin.toLocaleString()} - {country.currency}{estimateMax.toLocaleString()}
              </p>
              <p className="text-xs opacity-60 mt-2">Prices are approximate and vary by provider</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Driving Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-[#1A3C5E]" />
              Driving Info - {country.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Driving side */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Car className={cn('w-7 h-7 sm:w-8 sm:h-8 text-blue-600', country.drivingSide === 'Left' && '-scale-x-100')} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Drives on the</p>
                <p className="text-2xl font-bold text-blue-900">{country.drivingSide} Side</p>
              </div>
            </div>

            {/* License requirements */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-semibold text-amber-800">License Requirements</p>
              </div>
              <p className="text-sm text-amber-700">{country.licenseReq}</p>
            </div>

            {/* Speed limits table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-600">Zone</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-600">Speed Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 px-3 text-gray-700">Urban</td>
                    <td className="py-2.5 px-3 font-medium text-[#1A3C5E]">{country.speedLimits.urban}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 px-3 text-gray-700">Rural</td>
                    <td className="py-2.5 px-3 font-medium text-[#1A3C5E]">{country.speedLimits.rural}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-gray-700">Highway</td>
                    <td className="py-2.5 px-3 font-medium text-[#1A3C5E]">{country.speedLimits.highway}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
