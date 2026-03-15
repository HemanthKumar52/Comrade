'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, TreePine, TrendingDown, Award, Car, Train, Bike,
  Plane, Bus, Ship, Users, Zap, Home, UtensilsCrossed,
  Package, Building2, Footprints, Calculator, BarChart3,
  Trophy, Globe, Heart, ArrowRightLeft, Info,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ---- Data & Constants ----

const VEHICLE_TYPES = [
  { key: 'car', label: 'Car (Petrol)', co2PerKm: 0.12, icon: Car, color: '#EF4444' },
  { key: 'car_diesel', label: 'Car (Diesel)', co2PerKm: 0.11, icon: Car, color: '#F97316' },
  { key: 'car_ev', label: 'Car (Electric)', co2PerKm: 0.03, icon: Zap, color: '#06B6D4' },
  { key: 'bike', label: 'Motorcycle', co2PerKm: 0.07, icon: Bike, color: '#8B5CF6' },
  { key: 'bus', label: 'Bus', co2PerKm: 0.04, icon: Bus, color: '#F59E0B' },
  { key: 'train', label: 'Train', co2PerKm: 0.02, icon: Train, color: '#3B82F6' },
  { key: 'flight', label: 'Flight', co2PerKm: 0.15, icon: Plane, color: '#EC4899' },
  { key: 'ship', label: 'Ship / Ferry', co2PerKm: 0.06, icon: Ship, color: '#14B8A6' },
  { key: 'walking', label: 'Walking / Cycling', co2PerKm: 0, icon: Footprints, color: '#22C55E' },
];

const TRIP_HISTORY = [
  { name: 'Goa Trip', co2: 45, vehicle: 'car', distance: 600, month: 'Jan' },
  { name: 'Ladakh Ride', co2: 38, vehicle: 'bike', distance: 1200, month: 'Feb' },
  { name: 'Kerala Tour', co2: 120, vehicle: 'flight', distance: 2400, month: 'Mar' },
  { name: 'Rajasthan', co2: 65, vehicle: 'car', distance: 900, month: 'Apr' },
  { name: 'Shimla Trip', co2: 22, vehicle: 'train', distance: 350, month: 'May' },
  { name: 'Pondicherry', co2: 30, vehicle: 'bus', distance: 320, month: 'Jun' },
  { name: 'NE India', co2: 95, vehicle: 'flight', distance: 3200, month: 'Jul' },
  { name: 'Rishikesh', co2: 15, vehicle: 'bus', distance: 230, month: 'Aug' },
  { name: 'Hampi Trek', co2: 0, vehicle: 'walking', distance: 40, month: 'Sep' },
  { name: 'Mumbai Work', co2: 18, vehicle: 'train', distance: 900, month: 'Oct' },
  { name: 'Coorg Weekend', co2: 28, vehicle: 'car', distance: 380, month: 'Nov' },
  { name: 'Gokarna', co2: 12, vehicle: 'bus', distance: 300, month: 'Dec' },
];

const MONTHLY_TRENDS = [
  { month: 'Jan', co2: 45, trips: 1 },
  { month: 'Feb', co2: 38, trips: 1 },
  { month: 'Mar', co2: 120, trips: 1 },
  { month: 'Apr', co2: 65, trips: 1 },
  { month: 'May', co2: 22, trips: 1 },
  { month: 'Jun', co2: 30, trips: 1 },
  { month: 'Jul', co2: 95, trips: 2 },
  { month: 'Aug', co2: 15, trips: 1 },
  { month: 'Sep', co2: 0, trips: 1 },
  { month: 'Oct', co2: 18, trips: 1 },
  { month: 'Nov', co2: 28, trips: 1 },
  { month: 'Dec', co2: 12, trips: 1 },
];

const YEARLY_TRENDS = [
  { year: '2022', co2: 620, trips: 8 },
  { year: '2023', co2: 510, trips: 10 },
  { year: '2024', co2: 488, trips: 12 },
  { year: '2025', co2: 390, trips: 11 },
  { year: '2026', co2: 120, trips: 3 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma', avatar: 'PS', co2Total: 112, trips: 14, badge: 'Eco Warrior', color: 'bg-amber-100 text-amber-700' },
  { rank: 2, name: 'Arjun Patel', avatar: 'AP', co2Total: 168, trips: 12, badge: 'Green Rider', color: 'bg-gray-100 text-gray-600' },
  { rank: 3, name: 'Meera Nair', avatar: 'MN', co2Total: 205, trips: 10, badge: 'Planet Lover', color: 'bg-orange-100 text-orange-600' },
  { rank: 4, name: 'You', avatar: 'YU', co2Total: 488, trips: 12, badge: 'Eco Traveler', color: 'bg-green-100 text-green-700' },
  { rank: 5, name: 'Ravi Kumar', avatar: 'RK', co2Total: 530, trips: 9, badge: 'Green Starter', color: 'bg-blue-100 text-blue-600' },
  { rank: 6, name: 'Sneha Joshi', avatar: 'SJ', co2Total: 610, trips: 11, badge: 'Nature Friend', color: 'bg-purple-100 text-purple-600' },
  { rank: 7, name: 'Vikram Singh', avatar: 'VS', co2Total: 720, trips: 15, badge: 'Explorer', color: 'bg-teal-100 text-teal-600' },
];

const ECO_TIPS = [
  { icon: Train, title: 'Choose Trains Over Flights', desc: 'Trains emit up to 75% less CO2 than flights for equivalent distances. Night trains double as accommodation.', impact: 'High', color: 'bg-blue-50 border-blue-200' },
  { icon: Users, title: 'Carpool & Share Rides', desc: 'Carpooling with 3 others cuts per-person emissions by 75%. Use Partner to find travel buddies.', impact: 'High', color: 'bg-purple-50 border-purple-200' },
  { icon: Package, title: 'Pack Light', desc: 'Every 10kg of luggage increases fuel burn. Pack only essentials and save on emissions and baggage fees.', impact: 'Medium', color: 'bg-amber-50 border-amber-200' },
  { icon: Home, title: 'Stay Longer, Travel Less', desc: 'Fewer trips with longer stays dramatically reduces transport emissions while deepening cultural immersion.', impact: 'High', color: 'bg-teal-50 border-teal-200' },
  { icon: UtensilsCrossed, title: 'Eat Local & Seasonal', desc: 'Local food has a smaller transport footprint. Enjoy seasonal produce and support local farmers.', impact: 'Medium', color: 'bg-green-50 border-green-200' },
  { icon: Building2, title: 'Choose Eco-Certified Hotels', desc: 'Green-certified accommodations use renewable energy, reduce waste, and conserve water.', impact: 'Medium', color: 'bg-emerald-50 border-emerald-200' },
  { icon: Footprints, title: 'Walk & Cycle Locally', desc: 'Explore destinations on foot or by bicycle. Zero emissions, better health, and deeper discovery.', impact: 'High', color: 'bg-lime-50 border-lime-200' },
  { icon: Zap, title: 'Prefer Electric Vehicles', desc: 'EVs produce up to 70% fewer emissions than petrol cars. Many cities now offer EV rentals.', impact: 'High', color: 'bg-cyan-50 border-cyan-200' },
];

const PARTNER_NGOS = [
  { name: 'One Tree Planted', focus: 'Global reforestation', costPerTree: 40, logo: TreePine, url: 'onetreeplanted.org' },
  { name: 'Gold Standard', focus: 'Verified carbon credits', costPerTree: 55, logo: Award, url: 'goldstandard.org' },
  { name: 'Sankalp Taru', focus: 'India rural tree planting', costPerTree: 30, logo: Leaf, url: 'sankalptaru.org' },
];

const PIE_COLORS = ['#EF4444', '#F97316', '#06B6D4', '#8B5CF6', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#22C55E'];

// ---- Component ----

export default function CarbonPage() {
  // Calculator state
  const [calcVehicle, setCalcVehicle] = useState(0);
  const [calcDistance, setCalcDistance] = useState('');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Comparison state
  const [cmpVehicle1, setCmpVehicle1] = useState(0);
  const [cmpVehicle2, setCmpVehicle2] = useState(5);
  const [cmpDistance, setCmpDistance] = useState(500);

  // Offset state
  const [treesToPlant, setTreesToPlant] = useState(0);
  const [selectedNgo, setSelectedNgo] = useState(0);

  // Trend toggle
  const [trendView, setTrendView] = useState<'monthly' | 'yearly'>('monthly');

  // Loading simulation
  const [isLoading] = useState(false);

  // ---- Computed ----

  const totalCO2 = useMemo(() => TRIP_HISTORY.reduce((sum, t) => sum + t.co2, 0), []);
  const treesEquivalent = Math.ceil(totalCO2 / 22);

  const vehicleBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    TRIP_HISTORY.forEach((t) => {
      map[t.vehicle] = (map[t.vehicle] || 0) + t.co2;
    });
    return Object.entries(map)
      .map(([key, value]) => {
        const vt = VEHICLE_TYPES.find((v) => v.key === key);
        return { name: vt?.label || key, value, color: vt?.color || '#888' };
      })
      .sort((a, b) => b.value - a.value);
  }, []);

  const comparisonBarData = useMemo(() => {
    return VEHICLE_TYPES.filter((v) => v.co2PerKm > 0).map((v) => ({
      name: v.label.replace(' (Petrol)', '').replace(' (Diesel)', ' D').replace(' (Electric)', ' EV').replace(' / Ferry', ''),
      co2: +(v.co2PerKm * cmpDistance).toFixed(1),
      fill: v.color,
    }));
  }, [cmpDistance]);

  const maxTripCO2 = Math.max(...TRIP_HISTORY.map((t) => t.co2));

  // Calculator
  const handleCalculate = () => {
    const d = parseFloat(calcDistance);
    if (!d || d <= 0) return;
    const co2 = VEHICLE_TYPES[calcVehicle].co2PerKm * d;
    setCalcResult(co2);
  };

  // Comparison
  const v1CO2 = VEHICLE_TYPES[cmpVehicle1].co2PerKm * cmpDistance;
  const v2CO2 = VEHICLE_TYPES[cmpVehicle2].co2PerKm * cmpDistance;
  const maxCmp = Math.max(v1CO2, v2CO2);
  const savingsPercent = maxCmp > 0 ? Math.round((Math.abs(v1CO2 - v2CO2) / maxCmp) * 100) : 0;

  // Offset
  const treesNeeded = Math.ceil(totalCO2 / 22);
  const offsetPercent = treesNeeded > 0 ? Math.min(100, Math.round((treesToPlant / treesNeeded) * 100)) : 0;
  const offsetCost = treesToPlant * PARTNER_NGOS[selectedNgo].costPerTree;
  const co2Offset = treesToPlant * 22;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <Leaf className="w-7 h-7 text-green-500" />
          Carbon Footprint Tracker
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Calculate, track, compare, and offset your travel carbon emissions
        </p>
      </motion.div>

      {/* Lifetime Hero Card */}
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
                <p className="text-xs opacity-70 mt-2">
                  Across {TRIP_HISTORY.length} trips tracked
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:ml-auto">
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <TreePine className="w-6 h-6 mx-auto mb-1 opacity-90" />
                  <p className="text-[10px] opacity-80">Trees to Offset</p>
                  <p className="text-lg font-bold">{treesEquivalent}</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <TrendingDown className="w-6 h-6 mx-auto mb-1 opacity-90" />
                  <p className="text-[10px] opacity-80">vs Avg. Traveler</p>
                  <p className="text-lg font-bold">32% less</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                  <Globe className="w-6 h-6 mx-auto mb-1 opacity-90" />
                  <p className="text-[10px] opacity-80">Total Distance</p>
                  <p className="text-lg font-bold">
                    {TRIP_HISTORY.reduce((s, t) => s + t.distance, 0).toLocaleString()} km
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 gap-1">
          <TabsTrigger value="calculator" className="gap-1.5 text-xs sm:text-sm py-2">
            <Calculator className="w-4 h-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-1.5 text-xs sm:text-sm py-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="offset" className="gap-1.5 text-xs sm:text-sm py-2">
            <TreePine className="w-4 h-4" />
            Offset
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-1.5 text-xs sm:text-sm py-2">
            <Trophy className="w-4 h-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* ==================== CALCULATOR TAB ==================== */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trip Carbon Calculator */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#E8733A]" />
                    Trip Carbon Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Vehicle Type</label>
                    <select
                      value={calcVehicle}
                      onChange={(e) => { setCalcVehicle(Number(e.target.value)); setCalcResult(null); }}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                    >
                      {VEHICLE_TYPES.map((v, i) => (
                        <option key={v.key} value={i}>{v.label} ({v.co2PerKm} kg/km)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Distance (km)</label>
                    <Input
                      type="number"
                      min={1}
                      value={calcDistance}
                      onChange={(e) => { setCalcDistance(e.target.value); setCalcResult(null); }}
                      placeholder="Enter distance in kilometers"
                      className="h-11"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Info className="w-3.5 h-3.5" />
                    CO2 factor: {VEHICLE_TYPES[calcVehicle].co2PerKm} kg per km
                  </div>

                  <Button
                    onClick={handleCalculate}
                    disabled={!calcDistance || parseFloat(calcDistance) <= 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white gap-2 h-11"
                  >
                    <Leaf className="w-4 h-4" />
                    Calculate Emissions
                  </Button>

                  {calcResult !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-gradient-to-r from-[#1A3C5E] to-[#2a5a8a] rounded-xl text-white"
                    >
                      <p className="text-xs text-white/60 mb-1">Estimated CO2 Emissions</p>
                      <p className="text-4xl font-bold">{calcResult.toFixed(2)} <span className="text-lg opacity-70">kg CO2</span></p>
                      <Separator className="my-3 bg-white/20" />
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-white/50">Trees to absorb (1 yr)</p>
                          <p className="font-semibold">{Math.ceil(calcResult / 22)} trees</p>
                        </div>
                        <div>
                          <p className="text-white/50">Equivalent driving</p>
                          <p className="font-semibold">{(calcResult / 0.12).toFixed(0)} km by car</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Vehicle Comparison Tool */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-[#E8733A]" />
                    Vehicle Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Vehicle 1</label>
                      <select
                        value={cmpVehicle1}
                        onChange={(e) => setCmpVehicle1(Number(e.target.value))}
                        className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                      >
                        {VEHICLE_TYPES.map((v, i) => (
                          <option key={v.key} value={i}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Vehicle 2</label>
                      <select
                        value={cmpVehicle2}
                        onChange={(e) => setCmpVehicle2(Number(e.target.value))}
                        className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                      >
                        {VEHICLE_TYPES.map((v, i) => (
                          <option key={v.key} value={i}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Distance (km)</label>
                      <Input
                        type="number"
                        min={1}
                        value={cmpDistance}
                        onChange={(e) => setCmpDistance(Math.max(1, Number(e.target.value)))}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      {[{ idx: cmpVehicle1, co2: v1CO2, other: v2CO2 }, { idx: cmpVehicle2, co2: v2CO2, other: v1CO2 }].map((item, i) => {
                        const Ic = VEHICLE_TYPES[item.idx].icon;
                        return (
                          <div key={i} className="text-center">
                            <Ic className="w-6 h-6 mx-auto mb-1" style={{ color: VEHICLE_TYPES[item.idx].color }} />
                            <p className="text-xs text-gray-500 mb-2 truncate">{VEHICLE_TYPES[item.idx].label}</p>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                              <motion.div
                                key={`${item.idx}-${cmpDistance}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${maxCmp > 0 ? (item.co2 / maxCmp) * 100 : 0}%` }}
                                transition={{ duration: 0.6 }}
                                className={cn('h-full rounded-full', item.co2 <= item.other ? 'bg-green-400' : 'bg-red-400')}
                              />
                            </div>
                            <p className={cn('text-xl font-bold', item.co2 <= item.other ? 'text-green-600' : 'text-red-600')}>
                              {item.co2.toFixed(1)} kg
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    {v1CO2 !== v2CO2 && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        <span className="font-semibold text-green-600">
                          {v1CO2 < v2CO2 ? VEHICLE_TYPES[cmpVehicle1].label : VEHICLE_TYPES[cmpVehicle2].label}
                        </span>
                        {' '}saves{' '}
                        <span className="font-bold text-green-600">{savingsPercent}%</span> CO2
                        {' '}({Math.abs(v1CO2 - v2CO2).toFixed(1)} kg less)
                      </p>
                    )}
                  </div>

                  {/* All vehicles comparison bar */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">All vehicles for {cmpDistance} km</p>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonBarData} layout="vertical" margin={{ left: 55, right: 15 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10 }} unit=" kg" />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={50} />
                          <Tooltip
                            formatter={(value: number) => [`${value} kg CO2`, 'Emissions']}
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                          />
                          <Bar dataKey="co2" radius={[0, 4, 4, 0]}>
                            {comparisonBarData.map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ==================== DASHBOARD TAB ==================== */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Breakdown row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - by vehicle type */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Emissions by Vehicle Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vehicleBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {vehicleBreakdown.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${value} kg CO2`, 'Emissions']}
                          contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {vehicleBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600">{item.name}: {item.value} kg</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trip breakdown bars */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Trip Carbon Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {TRIP_HISTORY.map((trip, i) => {
                      const vt = VEHICLE_TYPES.find((v) => v.key === trip.vehicle);
                      const Icon = vt?.icon || Car;
                      return (
                        <motion.div
                          key={trip.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-3"
                        >
                          <Icon className="w-4 h-4 shrink-0" style={{ color: vt?.color }} />
                          <span className="text-xs font-medium text-gray-600 w-24 shrink-0 truncate">{trip.name}</span>
                          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${maxTripCO2 > 0 ? (trip.co2 / maxTripCO2) * 100 : 0}%` }}
                              transition={{ duration: 0.6, delay: i * 0.04 }}
                              className={cn(
                                'h-full rounded-full flex items-center justify-end pr-2',
                                trip.co2 === 0 ? 'bg-green-300' : trip.co2 > 80 ? 'bg-red-400' : trip.co2 > 40 ? 'bg-amber-400' : 'bg-green-400'
                              )}
                            >
                              {trip.co2 > 0 && (
                                <span className="text-[10px] font-bold text-white">{trip.co2}kg</span>
                              )}
                            </motion.div>
                            {trip.co2 === 0 && (
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-700">0 kg</span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 w-16 text-right shrink-0">{trip.distance} km</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trend Charts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#E8733A]" />
                    Emission Trends
                  </CardTitle>
                  <div className="flex gap-2">
                    {(['monthly', 'yearly'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setTrendView(v)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize',
                          trendView === v
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {trendView === 'monthly' ? (
                      <LineChart data={MONTHLY_TRENDS} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} unit=" kg" />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === 'co2' ? `${value} kg CO2` : `${value} trips`,
                            name === 'co2' ? 'Emissions' : 'Trips',
                          ]}
                          contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line
                          type="monotone"
                          dataKey="co2"
                          stroke="#22C55E"
                          strokeWidth={2}
                          dot={{ fill: '#22C55E', r: 4 }}
                          name="CO2 (kg)"
                        />
                        <Line
                          type="monotone"
                          dataKey="trips"
                          stroke="#E8733A"
                          strokeWidth={2}
                          dot={{ fill: '#E8733A', r: 4 }}
                          name="Trips"
                          yAxisId={0}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={YEARLY_TRENDS} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} unit=" kg" />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === 'co2' ? `${value} kg CO2` : `${value} trips`,
                            name === 'co2' ? 'Total Emissions' : 'Trips Taken',
                          ]}
                          contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="co2" fill="#22C55E" radius={[4, 4, 0, 0]} name="CO2 (kg)" />
                        <Bar dataKey="trips" fill="#E8733A" radius={[4, 4, 0, 0]} name="Trips" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-green-500" />
                    {trendView === 'monthly'
                      ? 'Lowest month: Sep (0 kg - all walking!)'
                      : 'Year-over-year trend: decreasing emissions'}
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px]">
                    Improving
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ==================== OFFSET TAB ==================== */}
        <TabsContent value="offset" className="space-y-6">
          {/* Offset Calculator */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                  <TreePine className="w-5 h-5" />
                  Carbon Offset - Virtual Tree Planting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                    <Leaf className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Total to Offset</p>
                    <p className="text-xl font-bold text-green-700">{totalCO2} kg</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                    <TreePine className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Trees Needed</p>
                    <p className="text-xl font-bold text-green-700">{treesNeeded}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                    <Heart className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Trees Pledged</p>
                    <p className="text-xl font-bold text-green-700">{treesToPlant}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                    <Award className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Offset Progress</p>
                    <p className="text-xl font-bold text-green-700">{offsetPercent}%</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>{treesToPlant} of {treesNeeded} trees</span>
                    <span>{co2Offset} of {totalCO2} kg offset</span>
                  </div>
                  <Progress value={offsetPercent} className="h-3" variant="accent" />
                </div>

                {/* Tree planter */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">How many trees would you like to plant?</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTreesToPlant(Math.max(0, treesToPlant - 1))}
                        className="h-10 w-10"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        value={treesToPlant}
                        onChange={(e) => setTreesToPlant(Math.max(0, Number(e.target.value)))}
                        className="w-24 text-center text-lg font-bold h-10"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTreesToPlant(treesToPlant + 1)}
                        className="h-10 w-10"
                      >
                        +
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTreesToPlant(treesNeeded)}
                        className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                      >
                        Full Offset ({treesNeeded})
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Partner NGO</label>
                    <select
                      value={selectedNgo}
                      onChange={(e) => setSelectedNgo(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                    >
                      {PARTNER_NGOS.map((ngo, i) => (
                        <option key={ngo.name} value={i}>
                          {ngo.name} - {ngo.focus} (Rs.{ngo.costPerTree}/tree)
                        </option>
                      ))}
                    </select>
                  </div>

                  {treesToPlant > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs opacity-80">Estimated Cost</p>
                          <p className="text-2xl font-bold">Rs.{offsetCost.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-80">CO2 Offset</p>
                          <p className="text-2xl font-bold">{co2Offset} kg</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    disabled={treesToPlant === 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white gap-2 h-12 text-base disabled:opacity-50"
                  >
                    <TreePine className="w-5 h-5" />
                    Plant {treesToPlant} Tree{treesToPlant !== 1 ? 's' : ''} Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Partner NGOs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#E8733A]" />
              Partnered NGOs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PARTNER_NGOS.map((ngo, i) => {
                const Logo = ngo.logo;
                return (
                  <motion.div
                    key={ngo.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow border-green-100">
                      <CardContent className="p-5">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                          <Logo className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-[#1A3C5E] mb-1">{ngo.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{ngo.focus}</p>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px]">
                          Rs.{ngo.costPerTree}/tree
                        </Badge>
                        <p className="text-[10px] text-gray-400 mt-2">{ngo.url}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Offset Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-green-600" />
                  Offset Recommendations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Start Small', desc: 'Plant 5 trees this month to offset your daily commute emissions.' },
                    { title: 'Flight Offset', desc: 'Your last flight emitted ~120 kg. Plant 6 trees to fully neutralize it.' },
                    { title: 'Monthly Goal', desc: 'Set a target of 3 trees/month to become carbon-neutral by year-end.' },
                    { title: 'Group Offset', desc: 'Invite travel buddies to jointly offset shared trip emissions.' },
                  ].map((rec) => (
                    <div key={rec.title} className="bg-white/80 rounded-lg p-3 border border-green-100">
                      <p className="text-sm font-semibold text-green-700">{rec.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{rec.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ==================== COMMUNITY TAB ==================== */}
        <TabsContent value="community" className="space-y-6">
          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Eco-Friendly Traveler Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Top 3 podium */}
                <div className="flex items-end justify-center gap-4 mb-6">
                  {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((user, i) => {
                    const heights = ['h-20', 'h-28', 'h-16'];
                    const sizes = ['text-sm', 'text-lg', 'text-sm'];
                    const medals = ['text-gray-400', 'text-amber-400', 'text-orange-400'];
                    return (
                      <div key={user.rank} className="text-center">
                        <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center font-bold mx-auto mb-2', sizes[i])}>
                          {user.avatar}
                        </div>
                        <p className="text-xs font-semibold text-gray-700 truncate max-w-[80px]">{user.name}</p>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          className={cn('bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg mt-2 flex items-end justify-center', heights[i])}
                        >
                          <Trophy className={cn('w-5 h-5 mb-2', medals[i])} />
                        </motion.div>
                        <p className="text-xs font-bold text-green-600 mt-1">{user.co2Total} kg</p>
                      </div>
                    );
                  })}
                </div>

                <Separator className="mb-4" />

                {/* Full leaderboard */}
                <div className="space-y-2.5">
                  {LEADERBOARD.map((user, i) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border transition-all',
                        user.name === 'You' ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-white border-gray-100 hover:bg-gray-50'
                      )}
                    >
                      <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0', user.color)}>
                        {user.rank}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-semibold truncate', user.name === 'You' ? 'text-green-700' : 'text-gray-700')}>
                          {user.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] py-0 border-green-200 text-green-600 bg-green-50">
                            {user.badge}
                          </Badge>
                          <span className="text-[10px] text-gray-400">{user.trips} trips</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-green-600">{user.co2Total} kg</p>
                        <p className="text-[10px] text-gray-400">total CO2</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Eco Tips & Suggestions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Eco-Tips & Suggestions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ECO_TIPS.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                  >
                    <Card className={cn('h-full border hover:shadow-md transition-shadow', tip.color)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-green-600" />
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] py-0',
                              tip.impact === 'High'
                                ? 'border-green-300 text-green-700 bg-green-100'
                                : 'border-amber-300 text-amber-700 bg-amber-100'
                            )}
                          >
                            {tip.impact} Impact
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm text-[#1A3C5E] mb-1">{tip.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
