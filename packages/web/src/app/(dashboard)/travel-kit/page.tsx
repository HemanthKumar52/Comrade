'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Search, Clock, Shield, Plug, Scale, Phone, DollarSign,
  Camera, Plane, Wine, Shirt, Car, AlertTriangle, Sun, Thermometer,
  Zap, Info, ChevronDown, MapPin, Users, Cigarette, ShoppingBag,
  HandCoins, Landmark, Baby, Eye, Gavel, Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/* ───────────────────────── Comprehensive Mock Data ───────────────────────── */

interface CountryData {
  code: string;
  name: string;
  flag: string;
  capital: string;
  region: string;
  callingCode: string;
  currency: { code: string; name: string; symbol: string };
  timezone: { name: string; utcOffset: number; dst: boolean };
  visa: { type: string; color: string; maxDays: number; processingTime: string };
  plug: { types: string[]; voltage: string; frequency: string; adapter: string };
  laws: {
    driving: { side: string; license: string; speedLimits: string };
    alcohol: { legalAge: number; publicDrinking: string };
    photography: string;
    drones: string;
    lgbtq: { safety: string; color: string };
    dressCode: string;
    tipping: string;
    bargaining: string;
    smoking: string;
    importRestrictions: string;
  };
  emergency: {
    police: string;
    ambulance: string;
    fire: string;
    universal: string;
    other: { label: string; number: string }[];
  };
  prices: {
    meal: string; coffee: string; taxi: string; hotel: string;
    exchangeRate: string; exchangeFrom: string;
  };
  weather: { bestMonths: string[]; avoid: string[]; note: string };
  safety: { level: number; label: string; description: string };
}

const allCountries: CountryData[] = [
  {
    code: 'US', name: 'United States', flag: '🇺🇸', capital: 'Washington D.C.', region: 'North America', callingCode: '+1',
    currency: { code: 'USD', name: 'US Dollar', symbol: '$' },
    timezone: { name: 'EST/PST (multiple)', utcOffset: -5, dst: true },
    visa: { type: 'Embassy Visa Required', color: 'red', maxDays: 180, processingTime: '3-5 weeks' },
    plug: { types: ['A', 'B'], voltage: '120V', frequency: '60Hz', adapter: 'Bring Type A/B adapter. Indian devices may need voltage converter (India uses 230V).' },
    laws: {
      driving: { side: 'Right', license: 'IDP recommended', speedLimits: '25-70 mph (40-112 km/h)' },
      alcohol: { legalAge: 21, publicDrinking: 'Illegal in most states' },
      photography: 'Generally unrestricted in public. No photos of military installations.',
      drones: 'FAA registration for >250g. No-fly near airports.',
      lgbtq: { safety: 'Generally safe, varies by state', color: 'green' },
      dressCode: 'No specific dress code. Casual widely accepted.',
      tipping: '15-20% at restaurants, $1-2 for service staff',
      bargaining: 'Not common except at flea markets',
      smoking: 'Banned in most indoor public spaces',
      importRestrictions: 'No fresh produce, meat, or dairy. Declare items over $800.',
    },
    emergency: {
      police: '911', ambulance: '911', fire: '911', universal: '911',
      other: [{ label: 'Poison Control', number: '1-800-222-1222' }, { label: 'Suicide Prevention', number: '988' }],
    },
    prices: { meal: '$12-25', coffee: '$4-6', taxi: '$2.50/mile', hotel: '$80-250/night', exchangeRate: '1 USD = 83.5 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['Apr', 'May', 'Sep', 'Oct'], avoid: ['Jul', 'Aug'], note: 'Varies hugely by region. Hot summers, cold winters in north.' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'Generally safe for tourists. Be aware of petty crime in major cities.' },
  },
  {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧', capital: 'London', region: 'Europe', callingCode: '+44',
    currency: { code: 'GBP', name: 'British Pound', symbol: '£' },
    timezone: { name: 'GMT/BST', utcOffset: 0, dst: true },
    visa: { type: 'Embassy Visa Required', color: 'red', maxDays: 180, processingTime: '3-4 weeks' },
    plug: { types: ['G'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type G adapter. Voltage is compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Left', license: 'IDP valid 12 months', speedLimits: '30-70 mph (48-112 km/h)' },
      alcohol: { legalAge: 18, publicDrinking: 'Legal in most areas, some cities have bans' },
      photography: 'Unrestricted. GDPR applies to identifiable individuals.',
      drones: 'CAA registration required. Max 120m altitude.',
      lgbtq: { safety: 'Very safe, strong legal protections', color: 'green' },
      dressCode: 'No specific dress code. Smart casual for restaurants.',
      tipping: '10-15% at restaurants (check if service charge included)',
      bargaining: 'Not common',
      smoking: 'Banned in all enclosed public spaces',
      importRestrictions: 'No meat/dairy from non-EU. Limited alcohol/tobacco allowance.',
    },
    emergency: {
      police: '999', ambulance: '999', fire: '999', universal: '112',
      other: [{ label: 'Non-Emergency Police', number: '101' }, { label: 'NHS Direct', number: '111' }],
    },
    prices: { meal: '£10-20', coffee: '£3-5', taxi: '£3-5/mile', hotel: '£60-200/night', exchangeRate: '1 GBP = 105.2 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['May', 'Jun', 'Jul', 'Sep'], avoid: ['Nov', 'Dec', 'Jan'], note: 'Mild but rainy. Bring layers and rain gear year-round.' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'Safe for tourists. Be aware of pickpockets in tourist areas.' },
  },
  {
    code: 'TH', name: 'Thailand', flag: '🇹🇭', capital: 'Bangkok', region: 'Southeast Asia', callingCode: '+66',
    currency: { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    timezone: { name: 'ICT', utcOffset: 7, dst: false },
    visa: { type: 'Visa on Arrival', color: 'green', maxDays: 30, processingTime: 'On arrival (~30 min)' },
    plug: { types: ['A', 'B', 'C', 'O'], voltage: '220V', frequency: '50Hz', adapter: 'Most Indian plugs work directly. Carry universal adapter to be safe.' },
    laws: {
      driving: { side: 'Left', license: 'IDP required', speedLimits: '50-120 km/h' },
      alcohol: { legalAge: 20, publicDrinking: 'No sales 14:00-17:00 and 00:00-11:00' },
      photography: 'No disrespectful photos of royal family or Buddhist images.',
      drones: 'Registration required with CAAT. No-fly over crowds.',
      lgbtq: { safety: 'Relatively tolerant, growing legal protections', color: 'yellow' },
      dressCode: 'Cover shoulders and knees at temples. Remove shoes.',
      tipping: '20-50 THB at restaurants. Not mandatory.',
      bargaining: 'Expected at markets and street vendors',
      smoking: 'Banned at beaches, temples, and public buildings',
      importRestrictions: 'No e-cigarettes. Limited alcohol/tobacco. No Buddha images for export.',
    },
    emergency: {
      police: '191', ambulance: '1669', fire: '199', universal: '1155',
      other: [{ label: 'Tourist Police', number: '1155' }, { label: 'Immigration', number: '1178' }],
    },
    prices: { meal: '฿50-200', coffee: '฿40-80', taxi: '฿35 start + ฿5.5/km', hotel: '฿500-3000/night', exchangeRate: '1 THB = 2.4 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb'], avoid: ['Apr', 'May'], note: 'Nov-Feb is cool & dry. Apr is extreme heat. Jun-Oct is rainy season.' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'Very popular with tourists. Beware of scams and motorbike rentals.' },
  },
  {
    code: 'JP', name: 'Japan', flag: '🇯🇵', capital: 'Tokyo', region: 'East Asia', callingCode: '+81',
    currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    timezone: { name: 'JST', utcOffset: 9, dst: false },
    visa: { type: 'Embassy Visa Required', color: 'orange', maxDays: 90, processingTime: '5-7 business days' },
    plug: { types: ['A', 'B'], voltage: '100V', frequency: '50/60Hz', adapter: 'Bring Type A adapter AND voltage converter. Japan uses only 100V.' },
    laws: {
      driving: { side: 'Left', license: 'IDP (Geneva Convention) required', speedLimits: '30-100 km/h' },
      alcohol: { legalAge: 20, publicDrinking: 'Legal. Vending machines sell alcohol.' },
      photography: 'No photos in many museums/temples. Ask permission for people.',
      drones: 'Registration required. Restricted in populated areas.',
      lgbtq: { safety: 'Generally safe, limited legal recognition', color: 'yellow' },
      dressCode: 'Business formal common. Modest at temples.',
      tipping: 'Not expected and can be considered rude',
      bargaining: 'Not practiced',
      smoking: 'Designated areas only. Fines for street smoking.',
      importRestrictions: 'No firearms, drugs, counterfeit goods. Medication limits apply.',
    },
    emergency: {
      police: '110', ambulance: '119', fire: '119', universal: '110',
      other: [{ label: 'Japan Helpline', number: '0570-064-211' }, { label: 'AMDA Medical', number: '03-5285-8088' }],
    },
    prices: { meal: '¥800-2000', coffee: '¥300-500', taxi: '¥410 start + ¥80/400m', hotel: '¥5000-25000/night', exchangeRate: '1 JPY = 0.56 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'], avoid: ['Jun', 'Jul'], note: 'Cherry blossoms in Apr. Rainy June. Hot humid summer. Beautiful autumn.' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'One of the safest countries. Extremely low crime rate.' },
  },
  {
    code: 'AE', name: 'UAE', flag: '🇦🇪', capital: 'Abu Dhabi', region: 'Middle East', callingCode: '+971',
    currency: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    timezone: { name: 'GST', utcOffset: 4, dst: false },
    visa: { type: 'Visa on Arrival', color: 'green', maxDays: 30, processingTime: 'On arrival (~15 min)' },
    plug: { types: ['C', 'D', 'G'], voltage: '220V', frequency: '50Hz', adapter: 'Indian Type D plugs work in many outlets. Carry Type G adapter for UK-style sockets.' },
    laws: {
      driving: { side: 'Right', license: 'IDP required', speedLimits: '40-140 km/h' },
      alcohol: { legalAge: 21, publicDrinking: 'Only in licensed venues. Zero tolerance DUI.' },
      photography: 'No photos of government buildings, military, or people without consent.',
      drones: 'GCAA permit required. Strict no-fly zones.',
      lgbtq: { safety: 'Same-sex relations are illegal. Exercise extreme caution.', color: 'red' },
      dressCode: 'Modest clothing expected. Cover shoulders and knees in public.',
      tipping: '10-15% at restaurants. Round up for taxis.',
      bargaining: 'Expected at souks and traditional markets',
      smoking: 'Banned in enclosed public spaces. Designated areas in malls.',
      importRestrictions: 'No pork, alcohol (duty free limits), or drugs. Prescription meds need documentation.',
    },
    emergency: {
      police: '999', ambulance: '998', fire: '997', universal: '112',
      other: [{ label: 'Coastguard', number: '996' }, { label: 'Electricity Emergency', number: '991' }],
    },
    prices: { meal: '30-80 AED', coffee: '15-25 AED', taxi: '12 AED start + 1.82/km', hotel: '200-800 AED/night', exchangeRate: '1 AED = 22.7 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], avoid: ['Jun', 'Jul', 'Aug'], note: 'Oct-Apr pleasant. Summer temperatures can exceed 45°C.' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'Very safe. Low crime rate. Strict laws - respect local customs.' },
  },
  {
    code: 'FR', name: 'France', flag: '🇫🇷', capital: 'Paris', region: 'Europe', callingCode: '+33',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    timezone: { name: 'CET', utcOffset: 1, dst: true },
    visa: { type: 'Schengen Visa Required', color: 'orange', maxDays: 90, processingTime: '2-3 weeks' },
    plug: { types: ['C', 'E'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type C/E adapter. Voltage compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Right', license: 'IDP required', speedLimits: '50-130 km/h' },
      alcohol: { legalAge: 18, publicDrinking: 'Legal in most public spaces' },
      photography: 'Generally unrestricted. Cannot publish photos of people without consent.',
      drones: 'Registration required for >800g. No-fly in Paris.',
      lgbtq: { safety: 'Very safe, strong legal protections', color: 'green' },
      dressCode: 'No face coverings in public (burqa ban). Smart casual dining.',
      tipping: 'Service charge included. Small tip (5-10%) appreciated.',
      bargaining: 'Not common except at flea markets',
      smoking: 'Banned in enclosed public spaces. Common on terraces.',
      importRestrictions: 'EU limits on tobacco/alcohol. No counterfeit goods.',
    },
    emergency: {
      police: '17', ambulance: '15', fire: '18', universal: '112',
      other: [{ label: 'SAMU (Medical)', number: '15' }, { label: 'SOS Doctor', number: '01 47 07 77 77' }],
    },
    prices: { meal: '€12-25', coffee: '€2-5', taxi: '€2.60 start + €1.07/km', hotel: '€60-250/night', exchangeRate: '1 EUR = 90.8 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['Apr', 'May', 'Jun', 'Sep'], avoid: ['Aug'], note: 'Mild climate. Paris lovely in spring. Many locals vacation in August.' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'Safe but beware of pickpockets in Paris metro and tourist sites.' },
  },
  {
    code: 'AU', name: 'Australia', flag: '🇦🇺', capital: 'Canberra', region: 'Oceania', callingCode: '+61',
    currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    timezone: { name: 'AEST/AWST (multiple)', utcOffset: 10, dst: true },
    visa: { type: 'eVisa Required', color: 'orange', maxDays: 90, processingTime: '1-4 weeks' },
    plug: { types: ['I'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type I adapter. Voltage compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Left', license: 'IDP required', speedLimits: '50-130 km/h' },
      alcohol: { legalAge: 18, publicDrinking: 'Banned in most public areas' },
      photography: 'Unrestricted in public. Some indigenous sites restrict photography.',
      drones: 'CASA registration required. No-fly near airports, people, emergencies.',
      lgbtq: { safety: 'Very safe, marriage equality since 2017', color: 'green' },
      dressCode: 'Very casual. Thongs (flip-flops) widely acceptable.',
      tipping: 'Not expected. 10% for exceptional service.',
      bargaining: 'Not practiced',
      smoking: 'Strict bans in public spaces, outdoor dining, beaches.',
      importRestrictions: 'Extremely strict biosecurity. Declare ALL food, plant, animal products.',
    },
    emergency: {
      police: '000', ambulance: '000', fire: '000', universal: '112',
      other: [{ label: 'Poisons Info', number: '13 11 26' }, { label: 'SES Emergency', number: '132 500' }],
    },
    prices: { meal: 'A$15-35', coffee: 'A$4-6', taxi: 'A$3.50 start + A$2.20/km', hotel: 'A$100-300/night', exchangeRate: '1 AUD = 54.1 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['Sep', 'Oct', 'Nov', 'Mar', 'Apr'], avoid: ['Dec', 'Jan', 'Feb'], note: 'Seasons reversed from Northern Hemisphere. Summer is Dec-Feb (very hot).' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'Very safe. Beware of wildlife, sun exposure, and ocean currents.' },
  },
  {
    code: 'SG', name: 'Singapore', flag: '🇸🇬', capital: 'Singapore', region: 'Southeast Asia', callingCode: '+65',
    currency: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    timezone: { name: 'SGT', utcOffset: 8, dst: false },
    visa: { type: 'Visa Free', color: 'green', maxDays: 30, processingTime: 'Stamp on arrival' },
    plug: { types: ['G'], voltage: '230V', frequency: '50Hz', adapter: 'Bring Type G adapter. Voltage compatible with Indian appliances.' },
    laws: {
      driving: { side: 'Left', license: 'IDP required', speedLimits: '50-90 km/h' },
      alcohol: { legalAge: 18, publicDrinking: 'No public drinking 10:30pm-7:00am (Liquor Control Zones)' },
      photography: 'Generally unrestricted. No photos of military installations.',
      drones: 'Permit required from CAAS. Very restricted.',
      lgbtq: { safety: 'Decriminalized in 2022, improving acceptance', color: 'yellow' },
      dressCode: 'Casual and smart casual. Conservative at places of worship.',
      tipping: 'Not expected. 10% service charge usually added.',
      bargaining: 'Not common except at some markets',
      smoking: 'Banned in most public spaces. Heavy fines.',
      importRestrictions: 'No chewing gum. Strict drug laws (death penalty). Declare >S$20,000.',
    },
    emergency: {
      police: '999', ambulance: '995', fire: '995', universal: '112',
      other: [{ label: 'Non-Emergency', number: '1800-255-0000' }, { label: 'Health Hotline', number: '1800-333-9999' }],
    },
    prices: { meal: 'S$5-20', coffee: 'S$4-7', taxi: 'S$3.20 start + S$0.22/400m', hotel: 'S$80-350/night', exchangeRate: '1 SGD = 62.3 INR', exchangeFrom: 'INR' },
    weather: { bestMonths: ['Feb', 'Mar', 'Apr', 'May'], avoid: ['Nov', 'Dec'], note: 'Hot and humid year-round. Nov-Jan is monsoon season.' },
    safety: { level: 1, label: 'Exercise Normal Precautions', description: 'Extremely safe. Very strict laws - follow all rules carefully.' },
  },
];

const homeTimezone = { name: 'IST', utcOffset: 5.5 };

const visaColorMap: Record<string, string> = {
  green: 'bg-green-100 text-green-800 border-green-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  red: 'bg-red-100 text-red-800 border-red-200',
};

const safetyLevelMap: Record<number, { bg: string; text: string; icon: string }> = {
  1: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: '🟢' },
  2: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', icon: '🟡' },
  3: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: '🟠' },
  4: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: '🔴' },
};

const lgbtqColorMap: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
};

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function TravelKitPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return allCountries;
    const q = searchQuery.toLowerCase();
    return allCountries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const country = allCountries.find((c) => c.code === selectedCode);

  const getLocalTime = (utcOffset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    return new Date(utc + utcOffset * 3600000);
  };

  const formatClock = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const homeTime = getLocalTime(homeTimezone.utcOffset);
  const destTime = country ? getLocalTime(country.timezone.utcOffset) : null;
  const hoursDiff = country ? Math.abs(homeTimezone.utcOffset - country.timezone.utcOffset) : 0;
  const jetLagDays = Math.ceil(hoursDiff / 2);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-[#1A3C5E]">International Travel Kit</h1>
        <p className="text-gray-500 mt-1">Everything you need to know before traveling to any country</p>
      </motion.div>

      {/* Country Explorer Selector */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <Card className="border-2 border-[#1A3C5E]/20 shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A3C5E] to-[#E8733A] flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A3C5E]">Country Explorer</h2>
                <p className="text-sm text-gray-500">Select a country to explore comprehensive travel information</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search countries by name, code, or capital..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-[#E8733A]"
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 relative"
                >
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1A3C5E]/5 transition-colors text-left',
                        selectedCode === c.code && 'bg-[#E8733A]/10'
                      )}
                      onClick={() => {
                        setSelectedCode(c.code);
                        setSearchQuery('');
                        setShowDropdown(false);
                      }}
                    >
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <p className="font-semibold text-[#1A3C5E]">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.capital} &middot; {c.region}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-xs">{c.code}</Badge>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-400">No countries found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick select chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {allCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setSelectedCode(c.code); setShowDropdown(false); setSearchQuery(''); }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedCode === c.code
                      ? 'bg-[#E8733A] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Country Detail Sections */}
      <AnimatePresence mode="wait">
        {country && (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Country Header */}
            <Card className="bg-gradient-to-r from-[#1A3C5E] to-[#2a5a87] text-white border-0 overflow-hidden">
              <CardContent className="py-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <span className="text-7xl">{country.flag}</span>
                  <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-bold">{country.name}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                      <Badge className="bg-white/20 text-white border-white/30">
                        <MapPin className="w-3 h-3 mr-1" /> {country.capital}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Globe className="w-3 h-3 mr-1" /> {country.region}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Phone className="w-3 h-3 mr-1" /> {country.callingCode}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <DollarSign className="w-3 h-3 mr-1" /> {country.currency.code} ({country.currency.symbol})
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Local Time + Timezone Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                      <Clock className="w-5 h-5 text-[#E8733A]" /> Current Local Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-5xl font-bold font-mono text-[#1A3C5E]">
                        {destTime && formatClock(destTime)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">{destTime && formatDate(destTime)}</p>
                      <div className="flex justify-center gap-3 mt-3">
                        <Badge variant="outline">{country.timezone.name}</Badge>
                        <Badge variant="outline">UTC{country.timezone.utcOffset >= 0 ? '+' : ''}{country.timezone.utcOffset}</Badge>
                        <Badge variant="outline" className={country.timezone.dst ? 'bg-yellow-50 text-yellow-700' : ''}>
                          {country.timezone.dst ? 'DST Active' : 'No DST'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                      <Globe className="w-5 h-5 text-[#E8733A]" /> Timezone Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Home ({homeTimezone.name})</p>
                        <p className="text-2xl font-bold font-mono text-[#1A3C5E] mt-1">{formatClock(homeTime)}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(homeTime)}</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{country.name} ({country.timezone.name})</p>
                        <p className="text-2xl font-bold font-mono text-[#E8733A] mt-1">{destTime && formatClock(destTime)}</p>
                        <p className="text-xs text-gray-500 mt-1">{destTime && formatDate(destTime)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Time Difference</p>
                        <p className="text-xl font-bold text-[#1A3C5E]">{hoursDiff}h {country.timezone.utcOffset > homeTimezone.utcOffset ? 'ahead' : 'behind'}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Jet Lag Recovery</p>
                        <p className="text-xl font-bold text-[#1A3C5E]">~{jetLagDays} day{jetLagDays !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Working Hours Overlap (9AM-5PM)</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 24 }, (_, h) => {
                          const homeH = (h + homeTimezone.utcOffset + 24) % 24;
                          const destH = (h + country.timezone.utcOffset + 24) % 24;
                          const homeW = homeH >= 9 && homeH < 17;
                          const destW = destH >= 9 && destH < 17;
                          return (
                            <div
                              key={h}
                              className={cn(
                                'flex-1 h-5 rounded-sm',
                                homeW && destW ? 'bg-green-400' : homeW || destW ? 'bg-yellow-200' : 'bg-gray-100'
                              )}
                              title={`UTC ${h}:00`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex gap-4 mt-1.5 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-green-400" /> Overlap</span>
                        <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-yellow-200" /> One side working</span>
                        <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-gray-100" /> Off hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Visa Info */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                    <Landmark className="w-5 h-5 text-[#E8733A]" /> Visa Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Badge className={cn('text-sm px-4 py-2 border', visaColorMap[country.visa.color])}>
                      {country.visa.type}
                    </Badge>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Max Stay</p>
                        <p className="font-semibold text-[#1A3C5E]">{country.visa.maxDays} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Processing</p>
                        <p className="font-semibold text-[#1A3C5E]">{country.visa.processingTime}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Plug & Power */}
            <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                    <Plug className="w-5 h-5 text-[#E8733A]" /> Plug & Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Plug Types</p>
                      <div className="flex gap-2">
                        {country.plug.types.map((t) => (
                          <div key={t} className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1A3C5E]/10 to-[#1A3C5E]/20 flex items-center justify-center text-xl font-bold text-[#1A3C5E] border-2 border-[#1A3C5E]/20">
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Voltage</p>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-bold text-[#1A3C5E]">{country.plug.voltage}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Frequency</p>
                      <span className="text-lg font-bold text-[#1A3C5E]">{country.plug.frequency}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Recommendation</p>
                      <p className="text-sm text-gray-600">{country.plug.adapter}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Local Laws */}
            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                    <Scale className="w-5 h-5 text-[#E8733A]" /> Local Laws & Customs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Driving */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Car className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Driving</p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p><span className="font-medium">Side:</span> {country.laws.driving.side}</p>
                          <p><span className="font-medium">License:</span> {country.laws.driving.license}</p>
                          <p><span className="font-medium">Speed:</span> {country.laws.driving.speedLimits}</p>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Alcohol */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Wine className="w-4 h-4 text-purple-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Alcohol</p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p><span className="font-medium">Legal Age:</span> {country.laws.alcohol.legalAge}</p>
                          <p><span className="font-medium">Public:</span> {country.laws.alcohol.publicDrinking}</p>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Photography */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Camera className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Photography</p>
                        </div>
                        <p className="text-xs text-gray-600">{country.laws.photography}</p>
                      </CardContent>
                    </Card>
                    {/* Drones */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                            <Plane className="w-4 h-4 text-sky-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Drones</p>
                        </div>
                        <p className="text-xs text-gray-600">{country.laws.drones}</p>
                      </CardContent>
                    </Card>
                    {/* LGBTQ+ */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <Heart className="w-4 h-4 text-pink-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">LGBTQ+ Safety</p>
                        </div>
                        <Badge className={cn('text-xs', lgbtqColorMap[country.laws.lgbtq.color])}>
                          {country.laws.lgbtq.safety}
                        </Badge>
                      </CardContent>
                    </Card>
                    {/* Dress Code */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Shirt className="w-4 h-4 text-indigo-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Dress Code</p>
                        </div>
                        <p className="text-xs text-gray-600">{country.laws.dressCode}</p>
                      </CardContent>
                    </Card>
                    {/* Tipping */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <HandCoins className="w-4 h-4 text-amber-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Tipping</p>
                        </div>
                        <p className="text-xs text-gray-600">{country.laws.tipping}</p>
                      </CardContent>
                    </Card>
                    {/* Bargaining */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-teal-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Bargaining</p>
                        </div>
                        <p className="text-xs text-gray-600">{country.laws.bargaining}</p>
                      </CardContent>
                    </Card>
                    {/* Smoking */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Cigarette className="w-4 h-4 text-gray-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Smoking</p>
                        </div>
                        <p className="text-xs text-gray-600">{country.laws.smoking}</p>
                      </CardContent>
                    </Card>
                    {/* Import */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <p className="font-semibold text-sm text-[#1A3C5E]">Import Restrictions</p>
                        </div>
                        <p className="text-xs text-gray-600">{country.laws.importRestrictions}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Numbers */}
            <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                    <Phone className="w-5 h-5 text-red-500" /> Emergency Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {[
                      { label: 'Police', number: country.emergency.police, icon: Shield, color: 'from-blue-500 to-blue-700' },
                      { label: 'Ambulance', number: country.emergency.ambulance, icon: Heart, color: 'from-red-500 to-red-700' },
                      { label: 'Fire', number: country.emergency.fire, icon: AlertTriangle, color: 'from-orange-500 to-orange-700' },
                      { label: 'Universal', number: country.emergency.universal, icon: Phone, color: 'from-green-500 to-green-700' },
                    ].map((em) => (
                      <a key={em.label} href={`tel:${em.number}`} className="block">
                        <Card className={cn('bg-gradient-to-br text-white border-0 hover:shadow-lg transition-shadow cursor-pointer', em.color)}>
                          <CardContent className="py-5 text-center">
                            <em.icon className="w-7 h-7 mx-auto mb-2" />
                            <p className="text-2xl font-bold font-mono">{em.number}</p>
                            <p className="text-xs text-white/80 mt-1">{em.label}</p>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                  {country.emergency.other.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {country.emergency.other.map((o) => (
                        <a key={o.label} href={`tel:${o.number}`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#E8733A] hover:bg-[#E8733A]/5 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-[#1A3C5E]/10 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-[#1A3C5E]" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[#1A3C5E]">{o.label}</p>
                            <p className="text-sm text-gray-500 font-mono">{o.number}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Currency Info */}
            <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                    <DollarSign className="w-5 h-5 text-[#E8733A]" /> Currency & Prices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-[#1A3C5E]/5 to-[#1A3C5E]/10 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Currency</p>
                      <p className="text-xl font-bold text-[#1A3C5E] mt-1">{country.currency.name}</p>
                      <p className="text-sm text-gray-500">{country.currency.code} ({country.currency.symbol})</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#E8733A]/5 to-[#E8733A]/10 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Exchange Rate</p>
                      <p className="text-xl font-bold text-[#E8733A] mt-1">{country.prices.exchangeRate}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Common Prices</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Meal', value: country.prices.meal, emoji: '🍽️' },
                      { label: 'Coffee', value: country.prices.coffee, emoji: '☕' },
                      { label: 'Taxi per km', value: country.prices.taxi, emoji: '🚕' },
                      { label: 'Hotel/night', value: country.prices.hotel, emoji: '🏨' },
                    ].map((p) => (
                      <div key={p.label} className="p-3 rounded-xl bg-gray-50 text-center">
                        <span className="text-2xl">{p.emoji}</span>
                        <p className="font-semibold text-[#1A3C5E] text-sm mt-1">{p.value}</p>
                        <p className="text-xs text-gray-500">{p.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weather */}
            <motion.div {...fadeIn} transition={{ delay: 0.45 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                    <Sun className="w-5 h-5 text-[#E8733A]" /> Best Time to Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => {
                      const isBest = country.weather.bestMonths.includes(m);
                      const isAvoid = country.weather.avoid.includes(m);
                      return (
                        <div
                          key={m}
                          className={cn(
                            'w-14 h-14 rounded-xl flex flex-col items-center justify-center text-xs font-medium border-2 transition-all',
                            isBest && 'bg-green-50 border-green-300 text-green-700',
                            isAvoid && 'bg-red-50 border-red-300 text-red-700',
                            !isBest && !isAvoid && 'bg-gray-50 border-gray-200 text-gray-500'
                          )}
                        >
                          <span className="font-bold">{m}</span>
                          <span className="text-[10px]">{isBest ? 'Best' : isAvoid ? 'Avoid' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-300" /> Best months</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-300" /> Avoid</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-200" /> Moderate</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-xl">
                    <Info className="w-4 h-4 inline mr-1 text-blue-500" />
                    {country.weather.note}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Advisory */}
            <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
              <Card className={cn('border', safetyLevelMap[country.safety.level]?.bg)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1A3C5E]">
                    <Shield className="w-5 h-5 text-[#E8733A]" /> Safety Advisory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{safetyLevelMap[country.safety.level]?.icon}</span>
                    <div>
                      <Badge className={cn('text-sm', safetyLevelMap[country.safety.level]?.text)}>
                        Level {country.safety.level}: {country.safety.label}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-2">{country.safety.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!country && (
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="text-center py-16">
          <Globe className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400">Select a country to explore</h3>
          <p className="text-sm text-gray-300 mt-1">Choose from the list above to see comprehensive travel information</p>
        </motion.div>
      )}
    </div>
  );
}
