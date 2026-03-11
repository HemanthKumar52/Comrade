'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, TreePine, TrendingDown, Award, Car, Train, Bike,
  Plane, Bus, Ship, Users, Zap, Home, UtensilsCrossed,
  Package, Building2, ArrowDown, ArrowUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tripCarbonData = [
  { name: 'Goa Trip', co2: 45, vehicle: 'Car', distance: 600 },
  { name: 'Ladakh Ride', co2: 38, vehicle: 'Bike', distance: 1200 },
  { name: 'Kerala Tour', co2: 120, vehicle: 'Flight', distance: 2400 },
  { name: 'Rajasthan', co2: 65, vehicle: 'Car', distance: 900 },
  { name: 'Shimla Trip', co2: 22, vehicle: 'Train', distance: 350 },
  { name: 'Pondicherry', co2: 30, vehicle: 'Bus', distance: 320 },
  { name: 'NE India', co2: 95, vehicle: 'Flight', distance: 3200 },
  { name: 'Rishikesh', co2: 15, vehicle: 'Bus', distance: 230 },
];

const maxCO2 = Math.max(...tripCarbonData.map((t) => t.co2));

const vehicles = [
  { name: 'Car (Petrol)', co2PerKm: 0.12, icon: Car },
  { name: 'Car (Diesel)', co2PerKm: 0.11, icon: Car },
  { name: 'Car (Electric)', co2PerKm: 0.03, icon: Zap },
  { name: 'Motorcycle', co2PerKm: 0.07, icon: Bike },
  { name: 'Bus', co2PerKm: 0.04, icon: Bus },
  { name: 'Train', co2PerKm: 0.02, icon: Train },
  { name: 'Flight', co2PerKm: 0.15, icon: Plane },
  { name: 'Ship/Ferry', co2PerKm: 0.06, icon: Ship },
];

const leaderboard = [
  { rank: 1, name: 'Priya Sharma', avatar: 'PS', co2PerKm: 0.018, badge: 'Eco Warrior' },
  { rank: 2, name: 'Arjun Patel', avatar: 'AP', co2PerKm: 0.022, badge: 'Green Rider' },
  { rank: 3, name: 'Meera Nair', avatar: 'MN', co2PerKm: 0.028, badge: 'Planet Lover' },
  { rank: 4, name: 'You', avatar: 'YU', co2PerKm: 0.035, badge: 'Eco Traveler' },
  { rank: 5, name: 'Ravi Kumar', avatar: 'RK', co2PerKm: 0.042, badge: 'Green Starter' },
];

const tips = [
  { icon: Train, title: 'Take Trains', desc: 'Trains emit 75% less CO2 than flights for similar distances.', color: 'bg-blue-50 border-blue-200' },
  { icon: Users, title: 'Share Rides', desc: 'Carpooling can cut your per-person emissions by 50-75%.', color: 'bg-purple-50 border-purple-200' },
  { icon: Package, title: 'Pack Light', desc: 'Every 10kg reduces fuel consumption. Pack only essentials.', color: 'bg-amber-50 border-amber-200' },
  { icon: Home, title: 'Stay Longer', desc: 'Fewer trips with longer stays means less transport emissions.', color: 'bg-teal-50 border-teal-200' },
  { icon: UtensilsCrossed, title: 'Eat Local', desc: 'Local food has lower transport footprint. Support local farmers.', color: 'bg-green-50 border-green-200' },
  { icon: Building2, title: 'Choose Eco-Hotels', desc: 'Eco-certified stays use renewable energy and reduce waste.', color: 'bg-emerald-50 border-emerald-200' },
];

const rankBadgeColor = ['bg-amber-100 text-amber-700', 'bg-gray-100 text-gray-600', 'bg-orange-100 text-orange-600', 'bg-green-100 text-green-700', 'bg-blue-100 text-blue-600'];

export default function CarbonPage() {
  const [vehicle1, setVehicle1] = useState(0);
  const [vehicle2, setVehicle2] = useState(5);
  const [distance, setDistance] = useState(500);

  const totalCO2 = tripCarbonData.reduce((sum, t) => sum + t.co2, 0);
  const treesEquivalent = Math.ceil(totalCO2 / 22);
  const offsetGoal = 500;
  const offsetProgress = Math.round((totalCO2 / offsetGoal) * 100);
  const treesNeeded = Math.ceil(totalCO2 / 22);
  const offsetCost = treesNeeded * 40;

  const v1CO2 = vehicles[vehicle1].co2PerKm * distance;
  const v2CO2 = vehicles[vehicle2].co2PerKm * distance;
  const maxV = Math.max(v1CO2, v2CO2);
  const diffPercent = maxV > 0 ? Math.round(Math.abs(v1CO2 - v2CO2) / maxV * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <Leaf className="w-7 h-7 text-green-500" />
          Carbon Footprint
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track, compare, and offset your travel emissions</p>
      </motion.div>

      {/* Lifetime CO2 Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm opacity-80 mb-1">Your Lifetime CO2 Emissions</p>
                <div className="flex items-end gap-2 justify-center sm:justify-start">
                  <span className="text-5xl sm:text-6xl font-bold">{totalCO2}</span>
                  <span className="text-2xl font-medium opacity-80 pb-1">kg</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:ml-auto">
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <TreePine className="w-6 h-6 mx-auto mb-1 opacity-90" />
                  <p className="text-xs opacity-80">Tree Equivalent</p>
                  <p className="text-lg font-bold">= {treesEquivalent} trees for 1 year</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <TrendingDown className="w-6 h-6 mx-auto mb-1 opacity-90" />
                  <p className="text-xs opacity-80">vs Average Traveler</p>
                  <p className="text-lg font-bold">32% less</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Trip Carbon Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trip Carbon Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tripCarbonData.map((trip, i) => (
                <motion.div
                  key={trip.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-medium text-gray-600 w-24 sm:w-28 shrink-0 truncate">{trip.name}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(trip.co2 / maxCO2) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className={cn(
                        'h-full rounded-full flex items-center justify-end pr-2',
                        trip.co2 > 80 ? 'bg-red-400' : trip.co2 > 40 ? 'bg-amber-400' : 'bg-green-400'
                      )}
                    >
                      <span className="text-[10px] font-bold text-white">{trip.co2}kg</span>
                    </motion.div>
                  </div>
                  <span className="text-[10px] text-gray-400 w-14 text-right shrink-0">{trip.vehicle}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Vehicle Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Vehicle 1</label>
                <select
                  value={vehicle1}
                  onChange={(e) => setVehicle1(Number(e.target.value))}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                >
                  {vehicles.map((v, i) => (
                    <option key={i} value={i}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Vehicle 2</label>
                <select
                  value={vehicle2}
                  onChange={(e) => setVehicle2(Number(e.target.value))}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                >
                  {vehicles.map((v, i) => (
                    <option key={i} value={i}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Distance (km)</label>
                <input
                  type="number"
                  min={1}
                  value={distance}
                  onChange={(e) => setDistance(Math.max(1, Number(e.target.value)))}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{vehicles[vehicle1].name}</p>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      key={`${vehicle1}-${distance}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${maxV > 0 ? (v1CO2 / maxV) * 100 : 0}%` }}
                      className={cn('h-full rounded-full', v1CO2 <= v2CO2 ? 'bg-green-400' : 'bg-red-400')}
                    />
                  </div>
                  <p className={cn('text-lg font-bold', v1CO2 <= v2CO2 ? 'text-green-600' : 'text-red-600')}>
                    {v1CO2.toFixed(1)} kg
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{vehicles[vehicle2].name}</p>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      key={`${vehicle2}-${distance}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${maxV > 0 ? (v2CO2 / maxV) * 100 : 0}%` }}
                      className={cn('h-full rounded-full', v2CO2 <= v1CO2 ? 'bg-green-400' : 'bg-red-400')}
                    />
                  </div>
                  <p className={cn('text-lg font-bold', v2CO2 <= v1CO2 ? 'text-green-600' : 'text-red-600')}>
                    {v2CO2.toFixed(1)} kg
                  </p>
                </div>
              </div>
              {v1CO2 !== v2CO2 && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  <span className="font-semibold text-green-600">{v1CO2 < v2CO2 ? vehicles[vehicle1].name : vehicles[vehicle2].name}</span>
                  {' '}saves <span className="font-bold text-green-600">{diffPercent}%</span> CO2
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Carbon Offset */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <TreePine className="w-5 h-5" />
              Carbon Offset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <TreePine className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Trees Needed</p>
                <p className="text-2xl font-bold text-green-700">{treesNeeded}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <Leaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Offset Cost</p>
                <p className="text-2xl font-bold text-green-700">₹{offsetCost.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">₹40/tree</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <TrendingDown className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Offset Progress</p>
                <p className="text-2xl font-bold text-green-700">{offsetProgress}%</p>
                <div className="w-full h-2 bg-green-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(offsetProgress, 100)}%` }} />
                </div>
              </div>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2 h-12 text-base">
              <Leaf className="w-5 h-5" /> Offset My Carbon
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Green Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Green Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user, i) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border transition-all',
                    user.name === 'You' ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-white border-gray-100'
                  )}
                >
                  <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0', rankBadgeColor[i] || 'bg-gray-100 text-gray-600')}>
                    {user.rank}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-semibold truncate', user.name === 'You' ? 'text-green-700' : 'text-gray-700')}>
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{user.badge}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-green-600">{user.co2PerKm}</p>
                    <p className="text-[10px] text-gray-400">kg/km</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reduce Impact Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">Reduce Your Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <Card className={cn('h-full border', tip.color)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-sm text-[#1A3C5E]">{tip.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
