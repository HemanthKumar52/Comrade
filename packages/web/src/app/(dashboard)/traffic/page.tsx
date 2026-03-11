'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car, AlertTriangle, Shield, Fuel, CircleAlert, ParkingCircle,
  Users, Siren, ArrowLeft, ArrowRight, Info, Scale, Volume2,
  Lightbulb, Wine, Baby, Smartphone, Sun, CircleDot,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrafficData {
  drivingSide: 'Left' | 'Right';
  speedLimits: { zone: string; limit: string }[];
  speedUnit: string;
  license: { idpNeeded: boolean; minAge: number; homeValidity: string };
  rules: { icon: React.ElementType; title: string; value: string; important?: boolean }[];
  fines: { violation: string; fine: string }[];
  uniqueRules: { text: string; severity: 'info' | 'warning' }[];
  fuelTypes: string[];
  parking: string[];
  roundabout: string;
  pedestrian: string;
}

const trafficDatabase: Record<string, TrafficData> = {
  India: {
    drivingSide: 'Left',
    speedLimits: [
      { zone: 'Urban', limit: '50 km/h' },
      { zone: 'Rural', limit: '80 km/h' },
      { zone: 'Expressway', limit: '120 km/h' },
      { zone: 'School Zone', limit: '25 km/h' },
    ],
    speedUnit: 'km/h',
    license: { idpNeeded: false, minAge: 18, homeValidity: 'Indian license valid domestically. IDP recommended for some rental agencies.' },
    rules: [
      { icon: Shield, title: 'Seatbelt', value: 'Mandatory for driver and front passenger', important: true },
      { icon: Baby, title: 'Child Seat', value: 'No specific law (recommended)', important: false },
      { icon: Smartphone, title: 'Mobile Phone', value: 'Strictly prohibited while driving. Fine applies.', important: true },
      { icon: Wine, title: 'Alcohol BAC', value: '0.03% (30mg/100ml)', important: true },
      { icon: Sun, title: 'Headlights', value: 'Required from sunset to sunrise', important: false },
      { icon: Volume2, title: 'Horn Usage', value: 'Widely used. Silent zones near hospitals/schools.', important: false },
    ],
    fines: [
      { violation: 'Speeding', fine: '₹1,000 - ₹2,000' },
      { violation: 'Drunk Driving', fine: '₹10,000 (first), ₹15,000 (repeat)' },
      { violation: 'No Seatbelt', fine: '₹1,000' },
      { violation: 'Red Light Jump', fine: '₹1,000 - ₹5,000' },
      { violation: 'Wrong Side Driving', fine: '₹5,000 - ₹10,000' },
      { violation: 'No Helmet (Two-Wheeler)', fine: '₹1,000 + 3-month suspension' },
      { violation: 'Mobile Phone While Driving', fine: '₹1,000 - ₹5,000' },
      { violation: 'No Insurance', fine: '₹2,000 (first), ₹4,000 (repeat)' },
    ],
    uniqueRules: [
      { text: 'Cows have right of way on roads in most states', severity: 'info' },
      { text: 'Honking is extremely common and often necessary for safety', severity: 'info' },
      { text: 'E-challan system means fines can be issued via CCTV cameras', severity: 'warning' },
      { text: 'Two-wheeler riders must wear helmets (including pillion)', severity: 'warning' },
    ],
    fuelTypes: ['Petrol (Unleaded)', 'Diesel', 'CNG (in metro cities)', 'EV Charging (expanding)'],
    parking: ['Paid parking zones in cities', 'No-parking violations strictly enforced in metros', 'Valet parking common at malls/hotels', 'Use FASTag for toll plazas'],
    roundabout: 'Vehicles already in the roundabout have priority. Give way before entering.',
    pedestrian: 'Pedestrians technically have right of way at zebra crossings, but exercise extreme caution.',
  },
  USA: {
    drivingSide: 'Right',
    speedLimits: [
      { zone: 'Urban/Residential', limit: '25-35 mph' },
      { zone: 'Rural', limit: '55 mph' },
      { zone: 'Highway', limit: '65-85 mph' },
      { zone: 'School Zone', limit: '15-25 mph' },
    ],
    speedUnit: 'mph',
    license: { idpNeeded: false, minAge: 16, homeValidity: 'Foreign licenses generally accepted. IDP recommended. Rules vary by state.' },
    rules: [
      { icon: Shield, title: 'Seatbelt', value: 'Mandatory in all states (laws vary by state)', important: true },
      { icon: Baby, title: 'Child Seat', value: 'Required for children under 8 (varies by state)', important: true },
      { icon: Smartphone, title: 'Mobile Phone', value: 'Hands-free only in most states', important: true },
      { icon: Wine, title: 'Alcohol BAC', value: '0.08% (21+), 0.00% (under 21)', important: true },
      { icon: Sun, title: 'Headlights', value: 'Required 30 min after sunset to 30 min before sunrise', important: false },
      { icon: Volume2, title: 'Horn Usage', value: 'Emergency use only. Illegal for frustration.', important: false },
    ],
    fines: [
      { violation: 'Speeding (10+ over)', fine: '$150 - $500+' },
      { violation: 'DUI', fine: '$1,000 - $10,000+ (varies by state)' },
      { violation: 'No Seatbelt', fine: '$25 - $200' },
      { violation: 'Running Red Light', fine: '$100 - $500' },
      { violation: 'Texting While Driving', fine: '$50 - $500' },
      { violation: 'No Insurance', fine: '$500 - $5,000+' },
    ],
    uniqueRules: [
      { text: 'Right turn on red is generally allowed (unless signed otherwise)', severity: 'info' },
      { text: 'School buses with flashing red lights - ALL traffic must stop', severity: 'warning' },
      { text: 'Carpool/HOV lanes require 2+ occupants during peak hours', severity: 'info' },
      { text: 'Move Over law: change lanes when emergency vehicles are stopped on shoulder', severity: 'warning' },
    ],
    fuelTypes: ['Regular (87 octane)', 'Plus (89 octane)', 'Premium (91-93 octane)', 'Diesel', 'EV Charging (Tesla Superchargers, ChargePoint)'],
    parking: ['Metered parking in cities', 'Fire hydrant: no parking within 15 feet', 'Color-coded curbs (red=no stopping, white=loading, green=short-term)', 'Always check street cleaning signs'],
    roundabout: 'Yield to traffic already in the roundabout. Enter when safe.',
    pedestrian: 'Pedestrians always have right of way in crosswalks. Heavy fines for violations.',
  },
  UK: {
    drivingSide: 'Left',
    speedLimits: [
      { zone: 'Urban/Built-up', limit: '30 mph' },
      { zone: 'Single Carriageway', limit: '60 mph' },
      { zone: 'Dual Carriageway/Motorway', limit: '70 mph' },
      { zone: 'Residential', limit: '20 mph' },
    ],
    speedUnit: 'mph',
    license: { idpNeeded: false, minAge: 17, homeValidity: 'EU/EEA licenses valid 12 months. IDP accepted for most countries.' },
    rules: [
      { icon: Shield, title: 'Seatbelt', value: 'Mandatory for all occupants', important: true },
      { icon: Baby, title: 'Child Seat', value: 'Required until 12 years or 135cm tall', important: true },
      { icon: Smartphone, title: 'Mobile Phone', value: 'Strictly prohibited. 6 points + £200 fine.', important: true },
      { icon: Wine, title: 'Alcohol BAC', value: '0.08% (England/Wales), 0.05% (Scotland)', important: true },
      { icon: Sun, title: 'Headlights', value: 'Required in poor visibility and at night', important: false },
      { icon: Volume2, title: 'Horn Usage', value: 'Not allowed in built-up areas 11:30pm-7:00am', important: false },
    ],
    fines: [
      { violation: 'Speeding', fine: '£100 - £2,500 + points' },
      { violation: 'Drink Driving', fine: 'Unlimited fine + 12-month ban' },
      { violation: 'No Seatbelt', fine: '£500' },
      { violation: 'Red Light', fine: '£100 + 3 points' },
      { violation: 'Mobile Phone', fine: '£200 + 6 points' },
      { violation: 'Congestion Charge (London)', fine: '£15/day (or £160 fine)' },
    ],
    uniqueRules: [
      { text: 'Congestion Charge applies in central London (£15/day)', severity: 'warning' },
      { text: 'ULEZ (Ultra Low Emission Zone) charges apply in London', severity: 'warning' },
      { text: 'Box junctions: do not enter unless your exit is clear', severity: 'info' },
      { text: 'Give way to traffic from the right at roundabouts', severity: 'info' },
    ],
    fuelTypes: ['Unleaded Petrol', 'Super Unleaded', 'Diesel', 'EV Charging (expanding rapidly)'],
    parking: ['Pay and Display zones common', 'Double yellow lines = no parking at any time', 'Single yellow lines = restricted hours', 'Resident permit zones in cities'],
    roundabout: 'Give way to traffic from the RIGHT. Signal your exit. Mini-roundabouts: give way to traffic from the right.',
    pedestrian: 'Zebra crossings give pedestrians absolute priority. Pelican/Toucan crossings are signal-controlled.',
  },
  Japan: {
    drivingSide: 'Left',
    speedLimits: [
      { zone: 'Urban', limit: '40 km/h' },
      { zone: 'Rural', limit: '60 km/h' },
      { zone: 'Expressway', limit: '100 km/h' },
      { zone: 'Residential', limit: '30 km/h' },
    ],
    speedUnit: 'km/h',
    license: { idpNeeded: true, minAge: 18, homeValidity: 'IDP required (Geneva Convention only). US licenses need JAF translation.' },
    rules: [
      { icon: Shield, title: 'Seatbelt', value: 'Mandatory for all occupants', important: true },
      { icon: Baby, title: 'Child Seat', value: 'Required for children under 6', important: true },
      { icon: Smartphone, title: 'Mobile Phone', value: 'Strictly prohibited. Heavy penalties.', important: true },
      { icon: Wine, title: 'Alcohol BAC', value: '0.03% (extremely strict)', important: true },
      { icon: Sun, title: 'Headlights', value: 'Required from sunset to sunrise', important: false },
      { icon: Volume2, title: 'Horn Usage', value: 'Use sparingly. Only at designated signs.', important: false },
    ],
    fines: [
      { violation: 'Speeding (30+ over)', fine: '¥50,000 - ¥100,000' },
      { violation: 'Drunk Driving', fine: '¥500,000 - ¥1,000,000 + jail' },
      { violation: 'No Seatbelt', fine: '1 point (no monetary fine)' },
      { violation: 'Red Light', fine: '¥90,000 + 2 points' },
      { violation: 'Mobile Phone', fine: '¥60,000 + 3 points' },
      { violation: 'Illegal Parking', fine: '¥15,000 - ¥25,000' },
    ],
    uniqueRules: [
      { text: 'Japan has extremely strict drunk driving laws. Even passengers can be fined.', severity: 'warning' },
      { text: 'Expressway tolls are very expensive. Get an ETC card for discounts.', severity: 'info' },
      { text: 'Flashing green lights mean the light is about to turn yellow', severity: 'info' },
      { text: 'Parking proof certificate (Shako Shomei) needed to own a car', severity: 'info' },
    ],
    fuelTypes: ['Regular (レギュラー)', 'High-Octane (ハイオク)', 'Diesel (軽油)', 'EV Charging'],
    parking: ['No on-street parking in most areas', 'Coin parking (コインパーキング) is ubiquitous', 'Department stores often offer free parking with purchase', 'Never park on narrow residential streets'],
    roundabout: 'Yield to traffic already in the roundabout. Roundabouts are rare in Japan; most intersections are signal-controlled.',
    pedestrian: 'Pedestrians always have right of way at crosswalks. Drivers must stop completely.',
  },
  Germany: {
    drivingSide: 'Right',
    speedLimits: [
      { zone: 'Urban', limit: '50 km/h' },
      { zone: 'Rural', limit: '100 km/h' },
      { zone: 'Autobahn', limit: 'No limit (130 km/h advisory)' },
      { zone: 'Residential (Zone 30)', limit: '30 km/h' },
    ],
    speedUnit: 'km/h',
    license: { idpNeeded: true, minAge: 18, homeValidity: 'EU licenses valid. Others need IDP + official German translation.' },
    rules: [
      { icon: Shield, title: 'Seatbelt', value: 'Mandatory for all occupants', important: true },
      { icon: Baby, title: 'Child Seat', value: 'Required until 12 years or 150cm', important: true },
      { icon: Smartphone, title: 'Mobile Phone', value: 'Prohibited while engine is running', important: true },
      { icon: Wine, title: 'Alcohol BAC', value: '0.05% (0.00% for new drivers)', important: true },
      { icon: Sun, title: 'Headlights', value: 'Dipped headlights recommended at all times', important: false },
      { icon: Volume2, title: 'Horn Usage', value: 'Emergency only. Prohibited in residential areas at night.', important: false },
    ],
    fines: [
      { violation: 'Speeding (21-25 km/h over, urban)', fine: '€115 + 1 point' },
      { violation: 'Drunk Driving (0.05-0.11%)', fine: '€500 + 1 month ban' },
      { violation: 'No Seatbelt', fine: '€30' },
      { violation: 'Red Light', fine: '€90-200 + 1-2 points' },
      { violation: 'Mobile Phone', fine: '€100 + 1 point' },
      { violation: 'Running out of fuel on Autobahn', fine: '€70 + 1 point' },
    ],
    uniqueRules: [
      { text: 'It is ILLEGAL to run out of fuel on the Autobahn', severity: 'warning' },
      { text: 'Stopping or walking on the Autobahn is strictly forbidden', severity: 'warning' },
      { text: 'Umweltzone (Environmental Zone) requires a green sticker', severity: 'warning' },
      { text: 'Rechtsfahrgebot: always drive in the rightmost lane unless overtaking', severity: 'info' },
    ],
    fuelTypes: ['Super (E5)', 'Super Plus (E5)', 'Super E10', 'Diesel', 'EV Charging (widespread)'],
    parking: ['Parkschein (parking ticket) machines are common', 'Blue zones require parking disc (Parkscheibe)', 'Underground garages (Tiefgarage) in city centers', 'P+R lots at train stations'],
    roundabout: 'Yield to traffic already in the roundabout. Do not signal when entering, only when exiting.',
    pedestrian: 'Pedestrians have right of way at zebra crossings. Jaywalking is frowned upon and can be fined.',
  },
};

const countryList = Object.keys(trafficDatabase);

export default function TrafficPage() {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const data = trafficDatabase[selectedCountry];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <CircleAlert className="w-7 h-7 text-[#E8733A]" />
          Traffic Rules & Driving Guide
        </h1>
        <p className="text-gray-500 text-sm mt-1">Know before you drive</p>
      </motion.div>

      {/* Country Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full sm:w-72 h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
        >
          {countryList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </motion.div>

      {/* Driving Side */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className={cn(
                'w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shrink-0',
                data.drivingSide === 'Left' ? 'bg-blue-100' : 'bg-green-100'
              )}>
                <div className="relative">
                  <Car className={cn(
                    'w-12 h-12 sm:w-14 sm:h-14',
                    data.drivingSide === 'Left' ? 'text-blue-600 -scale-x-100' : 'text-green-600'
                  )} />
                  {data.drivingSide === 'Left' ? (
                    <ArrowLeft className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 text-blue-600" />
                  ) : (
                    <ArrowRight className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 text-green-600" />
                  )}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">Drives on the</p>
                <p className={cn(
                  'text-4xl sm:text-5xl font-bold',
                  data.drivingSide === 'Left' ? 'text-blue-600' : 'text-green-600'
                )}>
                  {data.drivingSide} Side
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Steering wheel on the {data.drivingSide === 'Left' ? 'right' : 'left'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Speed Limits */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Siren className="w-5 h-5 text-red-500" />
                Speed Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.speedLimits.map((sl) => (
                  <div key={sl.zone} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-sm text-gray-600">{sl.zone}</span>
                    <span className="text-lg font-bold text-[#1A3C5E]">{sl.limit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* License Requirements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#1A3C5E]" />
                License Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-sm text-gray-600">IDP Needed?</span>
                <Badge className={cn(
                  data.license.idpNeeded
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-green-100 text-green-700 border-green-200'
                )}>
                  {data.license.idpNeeded ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-sm text-gray-600">Minimum Age</span>
                <span className="text-lg font-bold text-[#1A3C5E]">{data.license.minAge}+</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 mb-1">Home License Validity</p>
                <p className="text-sm text-blue-600">{data.license.homeValidity}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Key Rules */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">Key Rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.rules.map((rule, i) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.03 }}
              >
                <Card className={cn('h-full', rule.important && 'border-l-4 border-l-[#E8733A]')}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#1A3C5E]" />
                      </div>
                      <h4 className="text-sm font-bold text-[#1A3C5E]">{rule.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{rule.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Common Fines */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              Common Fines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-600">Violation</th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-600">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fines.map((fine, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-gray-700">{fine.violation}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-red-600">{fine.fine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Unique Rules */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">Unique Rules - {selectedCountry}</h2>
        <div className="space-y-3">
          {data.uniqueRules.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2',
                rule.severity === 'warning'
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-blue-50 border-blue-200'
              )}
            >
              {rule.severity === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <p className={cn(
                'text-sm font-medium',
                rule.severity === 'warning' ? 'text-amber-800' : 'text-blue-800'
              )}>
                {rule.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fuel Types */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Fuel className="w-5 h-5 text-green-500" />
                Fuel Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.fuelTypes.map((fuel) => (
                  <li key={fuel} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                    {fuel}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Parking Rules */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ParkingCircle className="w-5 h-5 text-blue-500" />
                Parking Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.parking.map((rule) => (
                  <li key={rule} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                    {rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Roundabout & Pedestrian */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CircleDot className="w-5 h-5 text-purple-500" />
                Road Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-[10px] font-bold text-purple-700 mb-1">ROUNDABOUTS</p>
                <p className="text-xs text-purple-600">{data.roundabout}</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                <p className="text-[10px] font-bold text-teal-700 mb-1">PEDESTRIAN CROSSINGS</p>
                <p className="text-xs text-teal-600">{data.pedestrian}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
