'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Globe2, Flag, Building2, Route, Calendar, TrendingUp,
  Car, Bike, Train, Plane, Bus, Sparkles, Trophy, Target,
  MapPin, Clock, Percent, Star, ChevronRight, BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const heroStats = [
  { label: 'Total KM', value: '4,287', icon: Globe2, color: 'from-blue-500 to-indigo-600' },
  { label: 'Countries', value: '4', icon: Flag, color: 'from-green-500 to-emerald-600' },
  { label: 'Cities', value: '23', icon: Building2, color: 'from-purple-500 to-violet-600' },
  { label: 'Trips', value: '12', icon: Route, color: 'from-orange-500 to-red-500' },
  { label: 'Days Traveling', value: '47', icon: Calendar, color: 'from-pink-500 to-rose-600' },
];

// Generate heatmap data (365 days)
const generateHeatmap = () => {
  const data: { date: string; intensity: number }[] = [];
  const startDate = new Date('2025-01-01');
  const travelDays = new Set([5, 6, 7, 15, 16, 17, 18, 45, 46, 47, 48, 49, 90, 91, 92, 120, 121, 122, 123, 124, 125, 150, 151, 180, 181, 182, 183, 210, 211, 240, 241, 242, 270, 271, 272, 273, 300, 301, 302, 330, 331, 332, 333, 334, 360, 361, 362]);
  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const intensity = travelDays.has(i) ? Math.floor(Math.random() * 3) + 1 : 0;
    data.push({ date: d.toISOString().split('T')[0], intensity });
  }
  return data;
};

const heatmapData = generateHeatmap();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthlyTripsData = [
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
];

const maxKm = Math.max(...monthlyTripsData.map((m) => m.km));

const vehicleUsage = [
  { name: 'Car', percentage: 42, color: 'bg-blue-500', icon: Car },
  { name: 'Bike', percentage: 28, color: 'bg-green-500', icon: Bike },
  { name: 'Train', percentage: 15, color: 'bg-purple-500', icon: Train },
  { name: 'Flight', percentage: 10, color: 'bg-amber-500', icon: Plane },
  { name: 'Bus', percentage: 5, color: 'bg-pink-500', icon: Bus },
];

const funFacts = [
  { emoji: '🛣️', text: 'You\'ve traveled the equivalent of 7 trips Mumbai-Delhi', highlight: '7 trips Mumbai-Delhi' },
  { emoji: '📏', text: 'Your longest trip was 1,200 km to Ladakh', highlight: '1,200 km to Ladakh' },
  { emoji: '📅', text: 'You\'ve spent 13% of the year traveling', highlight: '13%' },
  { emoji: '🏙️', text: 'Most visited city: Goa (4 times)', highlight: 'Goa (4 times)' },
  { emoji: '🚗', text: 'You prefer Car (42% of trips)', highlight: 'Car (42%)' },
  { emoji: '🌅', text: 'Average trip duration: 3.9 days', highlight: '3.9 days' },
];

const milestones = [
  { label: '5,000 km Legend', current: 4287, target: 5000, unit: 'km', color: 'bg-blue-500' },
  { label: '30 Cities Explorer', current: 23, target: 30, unit: 'cities', color: 'bg-purple-500' },
  { label: '5 Countries World Traveler', current: 4, target: 5, unit: 'countries', color: 'bg-green-500' },
  { label: '50 Days on the Road', current: 47, target: 50, unit: 'days', color: 'bg-amber-500' },
];

const intensityColor = (intensity: number) => {
  switch (intensity) {
    case 0: return 'bg-gray-100 dark:bg-gray-800';
    case 1: return 'bg-green-200';
    case 2: return 'bg-green-400';
    case 3: return 'bg-green-600';
    default: return 'bg-gray-100';
  }
};

export default function StatsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[#E8733A]" />
          Travel Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">Your journey in numbers</p>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {heroStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className={cn('bg-gradient-to-br text-white p-4 sm:p-5', stat.color)}>
                  <Icon className="w-6 h-6 opacity-80 mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-80 mt-0.5">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Travel Activity - 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[700px]">
                {/* Month labels */}
                <div className="flex mb-1 ml-8">
                  {months.map((m) => (
                    <span key={m} className="text-[10px] text-gray-400 flex-1 text-center">{m}</span>
                  ))}
                </div>
                {/* Heatmap grid */}
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
                                'w-[12px] h-[12px] rounded-[2px] transition-colors',
                                d ? intensityColor(d.intensity) : 'bg-gray-100'
                              )}
                              title={d ? `${d.date}: ${d.intensity > 0 ? 'Traveled' : 'Home'}` : ''}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Legend */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trips Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Distance (km)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-48">
                {monthlyTripsData.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-gray-500">{m.km > 0 ? m.km : ''}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${maxKm > 0 ? (m.km / maxKm) * 100 : 0}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={cn(
                        'w-full rounded-t-md min-h-[2px]',
                        m.km > 0 ? 'bg-gradient-to-t from-[#1A3C5E] to-[#3a7ab8]' : 'bg-gray-100'
                      )}
                    />
                    <span className="text-[10px] text-gray-400">{m.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Usage Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Simple donut representation */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      let offset = 0;
                      const colors = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899'];
                      return vehicleUsage.map((v, i) => {
                        const circumference = Math.PI * 70;
                        const dash = (v.percentage / 100) * circumference;
                        const elem = (
                          <circle
                            key={v.name}
                            cx="50" cy="50" r="35"
                            fill="none"
                            stroke={colors[i]}
                            strokeWidth="12"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                          />
                        );
                        offset += dash;
                        return elem;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-[#1A3C5E]">12</p>
                      <p className="text-[10px] text-gray-400">trips</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {vehicleUsage.map((v) => {
                    const Icon = v.icon;
                    return (
                      <div key={v.name} className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-full shrink-0', v.color)} />
                        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600 flex-1">{v.name}</span>
                        <span className="text-sm font-bold text-[#1A3C5E]">{v.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fun Facts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-lg font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E8733A]" />
          Fun Facts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {funFacts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-start gap-3">
                  <span className="text-2xl shrink-0">{fact.emoji}</span>
                  <p className="text-sm text-gray-600">{fact.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Travel Wrapped */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-[#1A3C5E] via-[#2a5a8a] to-[#E8733A] p-6 sm:p-8 text-white text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Travel Wrapped 2025</h2>
            <p className="text-sm opacity-80 mb-4">Your year in travel, beautifully summarized</p>
            <Button className="bg-white text-[#1A3C5E] hover:bg-white/90 gap-2 font-semibold">
              <Sparkles className="w-4 h-4" /> Generate Your Annual Summary
            </Button>
          </div>
        </Card>
      </motion.div>

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
                  <span className="font-bold text-[#E8733A]">4,287 km</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8733A] rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Average</span>
                  <span className="font-bold text-gray-400">1,429 km</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 rounded-full" style={{ width: '33%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                        className={cn('h-full rounded-full', m.color)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">{remaining} {m.unit}</span> to go
                    </p>
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
