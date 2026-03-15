'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2, Flag, Building2, Route, Calendar, TrendingUp,
  Car, Bike, Train, Plane, Bus, Sparkles, Trophy, Target,
  MapPin, Clock, Star, BarChart3, Award, Zap, Footprints,
  Mountain, Sunrise, Timer, Crown, Medal, ChevronRight,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Mock data (replaces API calls for full offline functionality)
// ---------------------------------------------------------------------------

const CURRENT_YEAR = 2026;
const YEARS = [2026, 2025, 2024];

// Overview
const overviewStats = {
  totalKm: 12_843,
  totalTrips: 34,
  totalCountries: 9,
  totalCities: 47,
  totalBadges: 18,
  totalXP: 8_420,
  currentLevel: 12,
  xpForNextLevel: 10_000,
  prevYearKm: 9_210,
};

// Distance breakdown by vehicle type
const distanceByVehicle = [
  { type: 'Car', km: 4120, trips: 14, icon: Car, color: '#3B82F6' },
  { type: 'Bike', km: 1850, trips: 8, icon: Bike, color: '#22C55E' },
  { type: 'Bus', km: 1260, trips: 5, icon: Bus, color: '#F59E0B' },
  { type: 'Train', km: 2340, trips: 4, icon: Train, color: '#8B5CF6' },
  { type: 'Flight', km: 2890, trips: 2, icon: Plane, color: '#EC4899' },
  { type: 'Trek', km: 383, trips: 6, icon: Footprints, color: '#14B8A6' },
];

// Monthly activity
const monthlyActivity: Record<number, { month: string; trips: number; km: number }[]> = {
  2026: [
    { month: 'Jan', trips: 3, km: 920 },
    { month: 'Feb', trips: 2, km: 640 },
    { month: 'Mar', trips: 1, km: 310 },
    { month: 'Apr', trips: 0, km: 0 },
    { month: 'May', trips: 0, km: 0 },
    { month: 'Jun', trips: 0, km: 0 },
    { month: 'Jul', trips: 0, km: 0 },
    { month: 'Aug', trips: 0, km: 0 },
    { month: 'Sep', trips: 0, km: 0 },
    { month: 'Oct', trips: 0, km: 0 },
    { month: 'Nov', trips: 0, km: 0 },
    { month: 'Dec', trips: 0, km: 0 },
  ],
  2025: [
    { month: 'Jan', trips: 2, km: 520 },
    { month: 'Feb', trips: 1, km: 280 },
    { month: 'Mar', trips: 3, km: 890 },
    { month: 'Apr', trips: 2, km: 650 },
    { month: 'May', trips: 4, km: 1340 },
    { month: 'Jun', trips: 1, km: 420 },
    { month: 'Jul', trips: 3, km: 1050 },
    { month: 'Aug', trips: 2, km: 780 },
    { month: 'Sep', trips: 1, km: 310 },
    { month: 'Oct', trips: 3, km: 1120 },
    { month: 'Nov', trips: 2, km: 690 },
    { month: 'Dec', trips: 4, km: 1160 },
  ],
  2024: [
    { month: 'Jan', trips: 1, km: 320 },
    { month: 'Feb', trips: 0, km: 0 },
    { month: 'Mar', trips: 2, km: 650 },
    { month: 'Apr', trips: 1, km: 280 },
    { month: 'May', trips: 2, km: 890 },
    { month: 'Jun', trips: 0, km: 0 },
    { month: 'Jul', trips: 1, km: 450 },
    { month: 'Aug', trips: 1, km: 320 },
    { month: 'Sep', trips: 2, km: 540 },
    { month: 'Oct', trips: 0, km: 0 },
    { month: 'Nov', trips: 1, km: 420 },
    { month: 'Dec', trips: 1, km: 417 },
  ],
};

// Heatmap generation helper
const generateHeatmap = () => {
  const data: { date: string; intensity: number }[] = [];
  const startDate = new Date('2025-01-01');
  const travelDays = new Set([
    5, 6, 7, 15, 16, 17, 18, 45, 46, 47, 48, 49,
    90, 91, 92, 120, 121, 122, 123, 124, 125,
    150, 151, 180, 181, 182, 183, 210, 211,
    240, 241, 242, 270, 271, 272, 273,
    300, 301, 302, 330, 331, 332, 333, 334, 360, 361, 362,
  ]);
  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const intensity = travelDays.has(i) ? Math.floor(Math.random() * 3) + 1 : 0;
    data.push({ date: d.toISOString().split('T')[0], intensity });
  }
  return data;
};
const heatmapData = generateHeatmap();
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Trip timeline
const tripTimeline = [
  { id: '1', title: 'Ladakh Road Trip', destination: 'Leh, India', startDate: '2025-12-18', endDate: '2025-12-28', km: 1200, vehicle: 'Car', badges: 3, xp: 850, color: 'bg-blue-500' },
  { id: '2', title: 'Goa Beach Getaway', destination: 'Goa, India', startDate: '2025-11-05', endDate: '2025-11-09', km: 580, vehicle: 'Flight', badges: 1, xp: 420, color: 'bg-pink-500' },
  { id: '3', title: 'Kerala Backwaters', destination: 'Alleppey, India', startDate: '2025-10-12', endDate: '2025-10-17', km: 340, vehicle: 'Train', badges: 2, xp: 560, color: 'bg-green-500' },
  { id: '4', title: 'Rajasthan Heritage Tour', destination: 'Jaipur, India', startDate: '2025-09-01', endDate: '2025-09-05', km: 780, vehicle: 'Car', badges: 2, xp: 640, color: 'bg-amber-500' },
  { id: '5', title: 'Himalayan Trek', destination: 'Manali, India', startDate: '2025-07-10', endDate: '2025-07-18', km: 95, vehicle: 'Trek', badges: 4, xp: 980, color: 'bg-teal-500' },
  { id: '6', title: 'Tokyo Explorer', destination: 'Tokyo, Japan', startDate: '2025-05-20', endDate: '2025-05-28', km: 2400, vehicle: 'Flight', badges: 3, xp: 920, color: 'bg-purple-500' },
  { id: '7', title: 'Pondicherry Weekend', destination: 'Pondicherry, India', startDate: '2025-03-15', endDate: '2025-03-17', km: 320, vehicle: 'Bike', badges: 1, xp: 280, color: 'bg-orange-500' },
  { id: '8', title: 'Coorg Coffee Trail', destination: 'Coorg, India', startDate: '2025-01-22', endDate: '2025-01-25', km: 280, vehicle: 'Car', badges: 1, xp: 310, color: 'bg-emerald-500' },
];

// Travel Wrapped
const wrappedData = {
  year: 2025,
  totalKm: 9_210,
  totalTrips: 28,
  totalDays: 67,
  longestTrip: { name: 'Ladakh Road Trip', km: 1200, days: 10 },
  mostVisitedCity: { name: 'Goa', visits: 4 },
  favoriteVehicle: { name: 'Car', percentage: 42 },
  earliestStart: { time: '4:30 AM', trip: 'Himalayan Trek' },
  countriesVisited: 4,
  badgesEarned: 14,
  topMonth: { name: 'May', km: 1340 },
  percentOfYear: 18,
};

// Milestones & Records
const records = [
  { label: 'Longest Single Trip', value: '1,200 km', detail: 'Ladakh Road Trip - Dec 2025', icon: Route, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Most KM in a Day', value: '487 km', detail: 'Day 3 of Ladakh Trip', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Fastest Badge Unlock', value: '2 hours', detail: '"First Steps" badge on Coorg trip', icon: Timer, color: 'text-green-500', bg: 'bg-green-50' },
  { label: 'Highest Altitude', value: '5,359m', detail: 'Khardung La, Ladakh', icon: Mountain, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Earliest Departure', value: '4:30 AM', detail: 'Himalayan Trek - Jul 2025', icon: Sunrise, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Most Badges in 1 Trip', value: '4 badges', detail: 'Himalayan Trek', icon: Medal, color: 'text-rose-500', bg: 'bg-rose-50' },
];

// Milestones (progress toward goals)
const milestones = [
  { label: '15,000 km Legend', current: 12_843, target: 15_000, unit: 'km', color: 'bg-blue-500' },
  { label: '50 Cities Explorer', current: 47, target: 50, unit: 'cities', color: 'bg-purple-500' },
  { label: '10 Countries Globetrotter', current: 9, target: 10, unit: 'countries', color: 'bg-green-500' },
  { label: '20 Badges Collector', current: 18, target: 20, unit: 'badges', color: 'bg-amber-500' },
];

// Helpers
const intensityColor = (intensity: number) => {
  switch (intensity) {
    case 0: return 'bg-gray-100 dark:bg-gray-800';
    case 1: return 'bg-green-200';
    case 2: return 'bg-green-400';
    case 3: return 'bg-green-600';
    default: return 'bg-gray-100';
  }
};

const vehicleIcon = (vehicle: string) => {
  const map: Record<string, typeof Car> = { Car, Bike, Bus, Train, Flight: Plane, Trek: Footprints };
  return map[vehicle] || MapPin;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const CHART_COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

// Custom recharts tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-[#1A3C5E] mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-gray-600">
          <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-medium">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function StatsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function StatsPage() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [wrappedRevealed, setWrappedRevealed] = useState(false);

  const currentMonthly = useMemo(
    () => monthlyActivity[selectedYear] || monthlyActivity[2025],
    [selectedYear],
  );

  const yearKmTotal = useMemo(
    () => currentMonthly.reduce((s, m) => s + m.km, 0),
    [currentMonthly],
  );

  const yearTripsTotal = useMemo(
    () => currentMonthly.reduce((s, m) => s + m.trips, 0),
    [currentMonthly],
  );

  const kmGrowth = overviewStats.totalKm - overviewStats.prevYearKm;
  const kmGrowthPct = Math.round((kmGrowth / overviewStats.prevYearKm) * 100);
  const xpProgress = Math.round((overviewStats.totalXP / overviewStats.xpForNextLevel) * 100);

  // Pie data for vehicle breakdown
  const pieData = distanceByVehicle.map((v) => ({ name: v.type, value: v.km }));

  if (isLoading) return <StatsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#E8733A]" />
            Travel Stats
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your journey in numbers</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="h-10 w-32 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-[#1A3C5E] focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* Tabs                                                             */}
      {/* ---------------------------------------------------------------- */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="wrapped">Wrapped</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* TAB: Overview                                                   */}
        {/* ============================================================== */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Overview stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Total KM', value: overviewStats.totalKm.toLocaleString(), icon: Globe2, gradient: 'from-blue-500 to-indigo-600' },
                { label: 'Trips', value: overviewStats.totalTrips.toString(), icon: Route, gradient: 'from-orange-500 to-red-500' },
                { label: 'Countries', value: overviewStats.totalCountries.toString(), icon: Flag, gradient: 'from-green-500 to-emerald-600' },
                { label: 'Cities', value: overviewStats.totalCities.toString(), icon: Building2, gradient: 'from-purple-500 to-violet-600' },
                { label: 'Badges', value: overviewStats.totalBadges.toString(), icon: Award, gradient: 'from-amber-500 to-yellow-600' },
                { label: 'Total XP', value: overviewStats.totalXP.toLocaleString(), icon: Zap, gradient: 'from-pink-500 to-rose-600' },
                { label: `Level ${overviewStats.currentLevel}`, value: `${xpProgress}%`, icon: Crown, gradient: 'from-[#1A3C5E] to-[#3a7ab8]' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all">
                      <div className={cn('bg-gradient-to-br text-white p-4', stat.gradient)}>
                        <Icon className="w-5 h-5 opacity-80 mb-1.5" />
                        <p className="text-xl sm:text-2xl font-bold leading-tight">{stat.value}</p>
                        <p className="text-[11px] opacity-80 mt-0.5">{stat.label}</p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Level / XP progress bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A3C5E] to-[#3a7ab8] flex items-center justify-center text-white">
                      <span className="text-lg font-bold">{overviewStats.currentLevel}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1A3C5E]">Level {overviewStats.currentLevel} Traveler</p>
                      <p className="text-xs text-gray-500">{overviewStats.totalXP.toLocaleString()} / {overviewStats.xpForNextLevel.toLocaleString()} XP to Level {overviewStats.currentLevel + 1}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        {kmGrowth > 0 ? (
                          <>
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">+{kmGrowthPct}%</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">{kmGrowthPct}%</span>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400">vs last year</p>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#E8733A] to-[#f59e0b]"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Heatmap */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#E8733A]" />
                    Travel Activity Heatmap - 2025
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto pb-2">
                    <div className="min-w-[700px]">
                      <div className="flex mb-1 ml-8">
                        {MONTHS_SHORT.map((m) => (
                          <span key={m} className="text-[10px] text-gray-400 flex-1 text-center">{m}</span>
                        ))}
                      </div>
                      <div className="flex gap-[2px]">
                        <div className="flex flex-col gap-[2px] mr-1">
                          {['Mon', '', 'Wed', '', 'Fri', '', ''].map((d, i) => (
                            <span key={i} className="text-[9px] text-gray-400 h-[12px] leading-[12px] w-6 text-right pr-1">{d}</span>
                          ))}
                        </div>
                        <div className="flex-1 flex gap-[2px]">
                          {Array.from({ length: 52 }).map((_, weekIdx) => (
                            <div key={weekIdx} className="flex flex-col gap-[2px]">
                              {Array.from({ length: 7 }).map((_, dayIdx) => {
                                const dataIdx = weekIdx * 7 + dayIdx;
                                const d = heatmapData[dataIdx];
                                return (
                                  <div
                                    key={dayIdx}
                                    className={cn(
                                      'w-[12px] h-[12px] rounded-[2px] transition-colors hover:ring-1 hover:ring-gray-300',
                                      d ? intensityColor(d.intensity) : 'bg-gray-100',
                                    )}
                                    title={d ? `${d.date}: ${d.intensity > 0 ? `Activity level ${d.intensity}` : 'No travel'}` : ''}
                                  />
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 justify-end">
                        <span className="text-[10px] text-gray-400">Less</span>
                        {[0, 1, 2, 3].map((level) => (
                          <div key={level} className={cn('w-[12px] h-[12px] rounded-[2px]', intensityColor(level))} />
                        ))}
                        <span className="text-[10px] text-gray-400">More</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vehicle Usage breakdown with icons + percentages */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#E8733A]" />
                    Vehicle Usage Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {distanceByVehicle.map((v, i) => {
                      const Icon = v.icon;
                      const pct = Math.round((v.km / overviewStats.totalKm) * 100);
                      return (
                        <motion.div
                          key={v.type}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                          className="text-center p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                        >
                          <div
                            className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2"
                            style={{ backgroundColor: `${v.color}15` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: v.color }} />
                          </div>
                          <p className="text-sm font-bold text-[#1A3C5E]">{v.type}</p>
                          <p className="text-lg font-bold" style={{ color: v.color }}>{pct}%</p>
                          <p className="text-[11px] text-gray-400">{v.km.toLocaleString()} km</p>
                          <p className="text-[10px] text-gray-400">{v.trips} trips</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Milestones */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <h2 className="text-lg font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Next Milestones
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {milestones.map((m, i) => {
                  const progress = Math.round((m.current / m.target) * 100);
                  const remaining = m.target - m.current;
                  return (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-[#1A3C5E]">{m.label}</h4>
                            <Badge variant="outline" className="text-[10px]">{progress}%</Badge>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                              className={cn('h-full rounded-full', m.color)}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">{remaining.toLocaleString()} {m.unit}</span> to go
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB: Charts                                                     */}
        {/* ============================================================== */}
        <TabsContent value="charts">
          <div className="space-y-6">
            {/* Distance Breakdown Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#E8733A]" />
                    Distance Breakdown by Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={distanceByVehicle} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="km" name="Distance (km)" radius={[6, 6, 0, 0]}>
                        {distanceByVehicle.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pie Chart - Vehicle share */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Vehicle Distance Share</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Monthly Activity Line Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Activity - {selectedYear}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={currentMonthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="km"
                          name="Distance (km)"
                          stroke="#E8733A"
                          strokeWidth={2.5}
                          dot={{ fill: '#E8733A', r: 4, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: '#E8733A', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="trips"
                          name="Trips"
                          stroke="#1A3C5E"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: '#1A3C5E', r: 3, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Monthly Activity Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#E8733A]" />
                      Trips Per Month - {selectedYear}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Total:</span>
                      <Badge className="bg-[#1A3C5E]">{yearTripsTotal} trips</Badge>
                      <Badge className="bg-[#E8733A]">{yearKmTotal.toLocaleString()} km</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={currentMonthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="trips" name="Trips" fill="#1A3C5E" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="km" name="Distance (km)" fill="#E8733A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB: Timeline                                                   */}
        {/* ============================================================== */}
        <TabsContent value="timeline">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-bold text-[#1A3C5E] flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-[#E8733A]" />
                Trip Timeline
              </h2>
              <p className="text-sm text-gray-500 mb-4">All your trips, most recent first</p>
            </motion.div>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />

              <div className="space-y-4">
                {tripTimeline.map((trip, i) => {
                  const VehicleIcon = vehicleIcon(trip.vehicle);
                  const startD = new Date(trip.startDate);
                  const endD = new Date(trip.endDate);
                  const days = Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex gap-4"
                    >
                      {/* Timeline dot */}
                      <div className="hidden sm:flex flex-col items-center">
                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 z-10', trip.color)}>
                          <VehicleIcon className="w-5 h-5" />
                        </div>
                      </div>

                      <Card className="flex-1 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-[#1A3C5E] flex items-center gap-2">
                                <VehicleIcon className="w-4 h-4 sm:hidden" />
                                {trip.title}
                              </h3>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {trip.destination}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px]">
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                              </Badge>
                            </div>
                          </div>

                          <Separator className="my-2" />

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                            <div>
                              <p className="text-lg font-bold text-[#1A3C5E]">{trip.km.toLocaleString()}</p>
                              <p className="text-[10px] text-gray-400">km traveled</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-[#1A3C5E]">{days}</p>
                              <p className="text-[10px] text-gray-400">days</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-[#E8733A]">{trip.vehicle}</p>
                              <p className="text-[10px] text-gray-400">vehicle</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-amber-500">{trip.badges}</p>
                              <p className="text-[10px] text-gray-400">badges</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-green-600">+{trip.xp}</p>
                              <p className="text-[10px] text-gray-400">XP earned</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB: Wrapped                                                    */}
        {/* ============================================================== */}
        <TabsContent value="wrapped">
          <div className="space-y-6">
            {/* Hero Banner */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-[#1A3C5E] via-[#2a5a8a] to-[#E8733A] p-8 sm:p-12 text-white text-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2">Travel Wrapped {wrappedData.year}</h2>
                  <p className="text-sm opacity-80 mb-6 max-w-md mx-auto">
                    Your year in travel, beautifully summarized with fun facts and highlights
                  </p>
                  {!wrappedRevealed ? (
                    <Button
                      onClick={() => setWrappedRevealed(true)}
                      className="bg-white text-[#1A3C5E] hover:bg-white/90 gap-2 font-semibold px-8 py-3 text-base"
                    >
                      <Sparkles className="w-5 h-5" /> Reveal My Wrapped
                    </Button>
                  ) : (
                    <Badge className="bg-white/20 text-white border-white/30 text-sm py-1 px-4">
                      {wrappedData.totalTrips} trips across {wrappedData.countriesVisited} countries
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>

            <AnimatePresence>
              {wrappedRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Big numbers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Distance', value: `${wrappedData.totalKm.toLocaleString()} km`, icon: Globe2, color: 'from-blue-500 to-blue-600' },
                      { label: 'Days on Road', value: wrappedData.totalDays.toString(), icon: Calendar, color: 'from-green-500 to-green-600' },
                      { label: 'Badges Earned', value: wrappedData.badgesEarned.toString(), icon: Award, color: 'from-amber-500 to-amber-600' },
                      { label: '% of Year Traveling', value: `${wrappedData.percentOfYear}%`, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                        >
                          <Card className="overflow-hidden">
                            <div className={cn('bg-gradient-to-br text-white p-5 text-center', item.color)}>
                              <Icon className="w-6 h-6 mx-auto mb-2 opacity-80" />
                              <p className="text-2xl font-bold">{item.value}</p>
                              <p className="text-[11px] opacity-80 mt-1">{item.label}</p>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Fun Facts Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Longest Trip',
                        value: wrappedData.longestTrip.name,
                        detail: `${wrappedData.longestTrip.km.toLocaleString()} km over ${wrappedData.longestTrip.days} days`,
                        icon: Route,
                        color: 'text-blue-500',
                        bg: 'bg-blue-50',
                      },
                      {
                        title: 'Most Visited City',
                        value: wrappedData.mostVisitedCity.name,
                        detail: `Visited ${wrappedData.mostVisitedCity.visits} times this year`,
                        icon: MapPin,
                        color: 'text-green-500',
                        bg: 'bg-green-50',
                      },
                      {
                        title: 'Favorite Vehicle',
                        value: wrappedData.favoriteVehicle.name,
                        detail: `Used for ${wrappedData.favoriteVehicle.percentage}% of all trips`,
                        icon: Car,
                        color: 'text-purple-500',
                        bg: 'bg-purple-50',
                      },
                      {
                        title: 'Earliest Start',
                        value: wrappedData.earliestStart.time,
                        detail: wrappedData.earliestStart.trip,
                        icon: Sunrise,
                        color: 'text-orange-500',
                        bg: 'bg-orange-50',
                      },
                      {
                        title: 'Best Month',
                        value: wrappedData.topMonth.name,
                        detail: `${wrappedData.topMonth.km.toLocaleString()} km traveled`,
                        icon: Star,
                        color: 'text-amber-500',
                        bg: 'bg-amber-50',
                      },
                      {
                        title: 'Countries Explored',
                        value: `${wrappedData.countriesVisited} countries`,
                        detail: 'Expanding your world map',
                        icon: Flag,
                        color: 'text-rose-500',
                        bg: 'bg-rose-50',
                      },
                    ].map((fact, i) => {
                      const Icon = fact.icon;
                      return (
                        <motion.div
                          key={fact.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.08 }}
                        >
                          <Card className="hover:shadow-md transition-all">
                            <CardContent className="p-4 flex items-start gap-4">
                              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', fact.bg)}>
                                <Icon className={cn('w-6 h-6', fact.color)} />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">{fact.title}</p>
                                <p className="text-lg font-bold text-[#1A3C5E]">{fact.value}</p>
                                <p className="text-sm text-gray-500">{fact.detail}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB: Records                                                    */}
        {/* ============================================================== */}
        <TabsContent value="records">
          <div className="space-y-6">
            {/* Milestones & Records */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-bold text-[#1A3C5E] flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-amber-500" />
                Personal Records
              </h2>
              <p className="text-sm text-gray-500 mb-4">Your all-time travel achievements</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card className="hover:shadow-lg transition-all h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', rec.bg)}>
                            <Icon className={cn('w-6 h-6', rec.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">{rec.label}</p>
                            <p className="text-xl font-bold text-[#1A3C5E] mt-0.5">{rec.value}</p>
                            <p className="text-sm text-gray-500 mt-1 truncate">{rec.detail}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Comparison */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#E8733A]/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-7 h-7 text-[#E8733A]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Compared to average travelers</p>
                      <p className="text-xl font-bold text-[#1A3C5E]">You travel 3x more!</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">You</span>
                        <span className="font-bold text-[#E8733A]">{overviewStats.totalKm.toLocaleString()} km</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-[#E8733A] rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Average Traveler</span>
                        <span className="font-bold text-gray-400">4,281 km</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '33%' }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-gray-300 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goal milestones */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-lg font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#E8733A]" />
                Milestone Progress
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {milestones.map((m, i) => {
                  const progress = Math.round((m.current / m.target) * 100);
                  const remaining = m.target - m.current;
                  return (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-[#1A3C5E]">{m.label}</h4>
                            <Badge variant="outline" className="text-[10px]">{progress}%</Badge>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                              className={cn('h-full rounded-full', m.color)}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{m.current.toLocaleString()} / {m.target.toLocaleString()} {m.unit}</span>
                            <span className="font-medium">{remaining.toLocaleString()} to go</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
