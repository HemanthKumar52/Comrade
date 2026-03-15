'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Activity, Waves, Flame, Cloud, Mountain, Shield,
  MapPin, Clock, Search, Globe, ChevronRight, Info, Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

type DisasterType = 'all' | 'earthquake' | 'cyclone' | 'flood' | 'volcano' | 'drought';
type Severity = 'green' | 'orange' | 'red';

interface DisasterAlert {
  id: string;
  type: DisasterType;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  severity: Severity;
  magnitude?: string;
  intensity?: string;
  dateTime: string;
  distanceKm?: number;
  affectsTrip?: boolean;
  tripName?: string;
  description: string;
}

interface SafetyTip {
  type: DisasterType;
  title: string;
  tips: string[];
}

/* ──────────────── Mock Data ──────────────── */

const disasterAlerts: DisasterAlert[] = [
  {
    id: '1', type: 'earthquake', name: 'Noto Peninsula Earthquake',
    location: 'Ishikawa, Japan', coordinates: { lat: 37.5, lng: 137.2 },
    severity: 'red', magnitude: '6.8', dateTime: '2026-03-14T08:23:00Z',
    distanceKm: 320, affectsTrip: true, tripName: 'Tokyo Spring Trip',
    description: 'Strong earthquake struck the Noto Peninsula region. Tsunami advisory issued for coastal areas.',
  },
  {
    id: '2', type: 'earthquake', name: 'Mindanao Earthquake',
    location: 'Davao, Philippines', coordinates: { lat: 7.1, lng: 125.6 },
    severity: 'orange', magnitude: '5.4', dateTime: '2026-03-14T14:05:00Z',
    distanceKm: 2800,
    description: 'Moderate earthquake felt across Davao region. No tsunami warning issued.',
  },
  {
    id: '3', type: 'cyclone', name: 'Cyclone Amphan II',
    location: 'Bay of Bengal, India', coordinates: { lat: 16.5, lng: 88.3 },
    severity: 'red', intensity: 'Category 4', dateTime: '2026-03-13T18:00:00Z',
    distanceKm: 450, affectsTrip: true, tripName: 'Kerala Backwaters',
    description: 'Severe cyclonic storm with wind speeds exceeding 200 km/h. Expected landfall in 48 hours.',
  },
  {
    id: '4', type: 'flood', name: 'Bangkok Flooding',
    location: 'Bangkok, Thailand', coordinates: { lat: 13.7, lng: 100.5 },
    severity: 'orange', intensity: 'Severe', dateTime: '2026-03-12T06:30:00Z',
    distanceKm: 1500,
    description: 'Heavy monsoon rains causing widespread flooding in low-lying areas of Bangkok metropolitan region.',
  },
  {
    id: '5', type: 'volcano', name: 'Mount Aso Eruption',
    location: 'Kumamoto, Japan', coordinates: { lat: 32.9, lng: 131.1 },
    severity: 'orange', intensity: 'Level 3', dateTime: '2026-03-13T22:15:00Z',
    distanceKm: 890, affectsTrip: true, tripName: 'Tokyo Spring Trip',
    description: 'Volcanic eruption with ash plume reaching 3,500m. 4km exclusion zone established.',
  },
  {
    id: '6', type: 'earthquake', name: 'Pacific Ring Tremor',
    location: 'Tonga, South Pacific', coordinates: { lat: -21.2, lng: -175.2 },
    severity: 'green', magnitude: '4.2', dateTime: '2026-03-14T11:45:00Z',
    distanceKm: 8500,
    description: 'Minor seismic activity detected along the Pacific Ring of Fire. No damage reported.',
  },
  {
    id: '7', type: 'drought', name: 'East African Drought',
    location: 'Kenya / Somalia', coordinates: { lat: 1.3, lng: 40.1 },
    severity: 'red', intensity: 'Extreme', dateTime: '2026-03-10T00:00:00Z',
    distanceKm: 5200,
    description: 'Prolonged drought conditions affecting millions. Water scarcity and crop failure reported.',
  },
  {
    id: '8', type: 'flood', name: 'Rhine River Overflow',
    location: 'Cologne, Germany', coordinates: { lat: 50.9, lng: 6.9 },
    severity: 'green', intensity: 'Moderate', dateTime: '2026-03-11T09:00:00Z',
    distanceKm: 7200,
    description: 'River levels rising above normal. Flood barriers activated. Minor disruptions expected.',
  },
  {
    id: '9', type: 'earthquake', name: 'Hokkaido Aftershock',
    location: 'Hokkaido, Japan', coordinates: { lat: 43.0, lng: 141.3 },
    severity: 'orange', magnitude: '5.1', dateTime: '2026-03-14T03:10:00Z',
    distanceKm: 510,
    description: 'Moderate aftershock following earlier seismic activity in the region.',
  },
  {
    id: '10', type: 'cyclone', name: 'Tropical Storm Nora',
    location: 'Queensland, Australia', coordinates: { lat: -17.8, lng: 146.0 },
    severity: 'green', intensity: 'Category 1', dateTime: '2026-03-13T12:00:00Z',
    distanceKm: 6800,
    description: 'Tropical storm weakening as it approaches the coast. Standard precautions advised.',
  },
];

const recentEarthquakes = [
  { location: 'Ishikawa, Japan', magnitude: 6.8, time: '4h ago' },
  { location: 'Hokkaido, Japan', magnitude: 5.1, time: '9h ago' },
  { location: 'Davao, Philippines', magnitude: 5.4, time: '6h ago' },
  { location: 'Tonga, Pacific', magnitude: 4.2, time: '8h ago' },
  { location: 'Santiago, Chile', magnitude: 3.8, time: '12h ago' },
  { location: 'Kathmandu, Nepal', magnitude: 3.2, time: '14h ago' },
  { location: 'Los Angeles, USA', magnitude: 2.9, time: '16h ago' },
];

const safetyTips: SafetyTip[] = [
  {
    type: 'earthquake', title: 'Earthquake Safety',
    tips: [
      'Drop, Cover, and Hold On during shaking.',
      'Move away from windows, heavy furniture, and exterior walls.',
      'If outdoors, stay in open areas away from buildings and power lines.',
      'After shaking stops, check for injuries and be prepared for aftershocks.',
      'Keep an emergency kit with water, food, flashlight, and first aid supplies.',
    ],
  },
  {
    type: 'cyclone', title: 'Cyclone Safety',
    tips: [
      'Monitor official weather bulletins and follow evacuation orders immediately.',
      'Secure or bring inside loose outdoor items like furniture and signs.',
      'Stay indoors away from windows during the storm.',
      'Stock up on water, non-perishable food, and essential medications.',
      'After the cyclone, avoid flooded roads and downed power lines.',
    ],
  },
  {
    type: 'flood', title: 'Flood Safety',
    tips: [
      'Move to higher ground immediately if flooding is imminent.',
      'Never walk, swim, or drive through flood waters.',
      'Disconnect electrical appliances if safe to do so.',
      'Avoid contact with flood water as it may be contaminated.',
      'Keep emergency supplies on upper floors of your accommodation.',
    ],
  },
  {
    type: 'volcano', title: 'Volcano Safety',
    tips: [
      'Follow all evacuation orders and stay outside the exclusion zone.',
      'Protect yourself from volcanic ash with masks or damp cloths.',
      'Close windows and doors to prevent ash from entering buildings.',
      'Avoid low-lying areas where volcanic gases may accumulate.',
      'Keep vehicle engines off during heavy ashfall to avoid damage.',
    ],
  },
  {
    type: 'drought', title: 'Drought Safety',
    tips: [
      'Conserve water wherever possible during your stay.',
      'Carry extra water when traveling through affected regions.',
      'Be aware of fire risks as drought conditions increase wildfire danger.',
      'Follow local water usage restrictions and guidelines.',
      'Stay hydrated and protect yourself from extreme heat.',
    ],
  },
];

const filterTabs: { label: string; value: DisasterType; icon: React.ElementType }[] = [
  { label: 'All', value: 'all', icon: Globe },
  { label: 'Earthquakes', value: 'earthquake', icon: Activity },
  { label: 'Cyclones', value: 'cyclone', icon: Cloud },
  { label: 'Floods', value: 'flood', icon: Waves },
  { label: 'Volcanoes', value: 'volcano', icon: Mountain },
  { label: 'Drought', value: 'drought', icon: Flame },
];

const severityStyles: Record<Severity, { bg: string; text: string; label: string; dot: string; border: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-700', label: 'Low', dot: 'bg-green-500', border: 'border-green-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Moderate', dot: 'bg-orange-500', border: 'border-orange-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', label: 'Critical', dot: 'bg-red-500', border: 'border-red-200' },
};

const typeIcons: Record<string, React.ElementType> = {
  earthquake: Activity,
  cyclone: Cloud,
  flood: Waves,
  volcano: Mountain,
  drought: Flame,
};

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ──────────────── Component ──────────────── */

export default function DisasterAlertsPage() {
  const [activeFilter, setActiveFilter] = useState<DisasterType>('all');
  const [search, setSearch] = useState('');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const filteredAlerts = disasterAlerts.filter((alert) => {
    const matchesType = activeFilter === 'all' || alert.type === activeFilter;
    const matchesSearch = !search || alert.name.toLowerCase().includes(search.toLowerCase()) || alert.location.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getMagnitudeColor = (mag: number) => {
    if (mag > 6) return 'bg-red-500';
    if (mag >= 5) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getMagnitudeTextColor = (mag: number) => {
    if (mag > 6) return 'text-red-700';
    if (mag >= 5) return 'text-orange-700';
    return 'text-green-700';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-[#1A3C5E]">Disaster Alerts</h1>
        <p className="text-gray-500 mt-1">Real-time natural hazard monitoring for travelers</p>
      </motion.div>

      {/* World Map Placeholder */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="relative h-64 bg-gradient-to-br from-[#1A3C5E]/5 to-[#1A3C5E]/15 rounded-xl overflow-hidden">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full border-t border-[#1A3C5E]" style={{ top: `${(i + 1) * 11}%` }} />
                ))}
                {[...Array(12)].map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full border-l border-[#1A3C5E]" style={{ left: `${(i + 1) * 8}%` }} />
                ))}
              </div>
              {/* Alert pins */}
              {disasterAlerts.slice(0, 6).map((alert, i) => {
                const style = severityStyles[alert.severity];
                const positions = [
                  { top: '25%', left: '78%' },
                  { top: '55%', left: '82%' },
                  { top: '42%', left: '65%' },
                  { top: '48%', left: '72%' },
                  { top: '30%', left: '76%' },
                  { top: '65%', left: '15%' },
                ];
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                    className="absolute"
                    style={positions[i]}
                  >
                    <div className="relative group cursor-pointer">
                      <div className={cn('w-4 h-4 rounded-full animate-pulse', style.dot)} />
                      <div className={cn('absolute w-8 h-8 rounded-full -top-2 -left-2 animate-ping opacity-30', style.dot)} />
                      <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 z-10 whitespace-nowrap border border-gray-200">
                        <p className="text-xs font-semibold text-[#1A3C5E]">{alert.name}</p>
                        <p className="text-[10px] text-gray-500">{alert.location}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-4 shadow-sm">
                <span className="text-[10px] font-medium text-gray-500 uppercase">Severity:</span>
                {Object.entries(severityStyles).map(([key, style]) => (
                  <span key={key} className="flex items-center gap-1.5">
                    <span className={cn('w-2.5 h-2.5 rounded-full', style.dot)} />
                    <span className={cn('text-[10px] font-medium', style.text)}>{style.label}</span>
                  </span>
                ))}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm">
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  World Hazard Map
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search + Filter Tabs */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search alerts by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
                  activeFilter === tab.value
                    ? 'bg-[#1A3C5E] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Alert Cards */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => {
                const style = severityStyles[alert.severity];
                const TypeIcon = typeIcons[alert.type] || AlertTriangle;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn('border', style.border, 'hover:shadow-md transition-shadow')}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', style.bg)}>
                            <TypeIcon className={cn('w-6 h-6', style.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-[#1A3C5E]">{alert.name}</h3>
                                  <Badge className={cn('text-[10px] py-0', style.bg, style.text, style.border)}>
                                    {style.label}
                                  </Badge>
                                  {alert.affectsTrip && (
                                    <Badge className="text-[10px] py-0 bg-red-100 text-red-700 border-red-300 animate-pulse">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Affects Your Trip
                                    </Badge>
                                  )}
                                </div>
                                {alert.affectsTrip && alert.tripName && (
                                  <p className="text-[10px] text-red-600 font-medium mt-0.5">
                                    Near destination: {alert.tripName}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{alert.description}</p>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {alert.location}
                              </span>
                              {alert.magnitude && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Activity className="w-3 h-3" />
                                  Magnitude: {alert.magnitude}
                                </span>
                              )}
                              {alert.intensity && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Zap className="w-3 h-3" />
                                  {alert.intensity}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {new Date(alert.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })},{' '}
                                {new Date(alert.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {alert.distanceKm && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <ChevronRight className="w-3 h-3" />
                                  {alert.distanceKm.toLocaleString()} km away
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No alerts found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Recent Earthquakes */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E8733A]" />
              Recent Earthquakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEarthquakes.map((eq, index) => (
                <motion.div
                  key={eq.location}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0',
                    getMagnitudeColor(eq.magnitude),
                  )}>
                    {eq.magnitude}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#1A3C5E] truncate">{eq.location}</p>
                      <span className="text-[10px] text-gray-400 shrink-0">{eq.time}</span>
                    </div>
                    <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((eq.magnitude / 8) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                        className={cn('h-full rounded-full', getMagnitudeColor(eq.magnitude))}
                      />
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px] py-0 shrink-0', getMagnitudeTextColor(eq.magnitude))}>
                    {eq.magnitude > 6 ? 'Strong' : eq.magnitude >= 5 ? 'Moderate' : 'Minor'}
                  </Badge>
                </motion.div>
              ))}
            </div>
            {/* Scale Legend */}
            <div className="flex items-center gap-4 mt-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-[10px] font-medium text-gray-500 uppercase">Scale:</span>
              <span className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-green-700">&lt; 5.0 Minor</span>
              </span>
              <span className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-orange-700">5.0-6.0 Moderate</span>
              </span>
              <span className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-red-700">&gt; 6.0 Strong</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Safety Tips */}
      <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1A3C5E]" />
              Safety Tips by Disaster Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyTips.map((tip, index) => {
                const TypeIcon = typeIcons[tip.type] || AlertTriangle;
                const isExpanded = expandedTip === tip.type;
                return (
                  <motion.div
                    key={tip.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + index * 0.05 }}
                  >
                    <button
                      onClick={() => setExpandedTip(isExpanded ? null : tip.type)}
                      className="w-full text-left"
                    >
                      <div className={cn(
                        'p-4 rounded-xl border transition-all',
                        isExpanded ? 'bg-[#1A3C5E]/5 border-[#1A3C5E]/20' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#E8733A]/10 flex items-center justify-center">
                              <TypeIcon className="w-5 h-5 text-[#E8733A]" />
                            </div>
                            <h4 className="font-semibold text-[#1A3C5E]">{tip.title}</h4>
                          </div>
                          <ChevronRight className={cn(
                            'w-4 h-4 text-gray-400 transition-transform',
                            isExpanded && 'rotate-90'
                          )} />
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <ul className="mt-3 space-y-2 pl-13">
                                {tip.tips.map((t, tIdx) => (
                                  <li key={tIdx} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Info className="w-3.5 h-3.5 text-[#E8733A] mt-0.5 shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
