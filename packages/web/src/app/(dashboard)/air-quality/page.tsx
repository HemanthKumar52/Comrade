'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wind, Leaf, Heart, AlertCircle, ThermometerSun, Droplets, Activity,
  Search, MapPin, Clock, TrendingUp, Shield, ChevronRight, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface CityAQI {
  id: string;
  city: string;
  country: string;
  flag: string;
  aqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  co: number;
  temperature: number;
  humidity: number;
  lastUpdated: string;
  trend: number[];
}

interface AQILevel {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  ringColor: string;
  description: string;
  healthAdvice: string[];
}

/* ──────────────── Mock Data ──────────────── */

const getAQILevel = (aqi: number): AQILevel => {
  if (aqi <= 50) return {
    label: 'Good',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    ringColor: 'stroke-green-500',
    description: 'Air quality is satisfactory with little or no health risk.',
    healthAdvice: [
      'Air quality is ideal for outdoor activities.',
      'Enjoy outdoor exercise and recreation.',
      'No special precautions needed.',
    ],
  };
  if (aqi <= 100) return {
    label: 'Moderate',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    ringColor: 'stroke-yellow-500',
    description: 'Air quality is acceptable; moderate health concern for a very small number of people.',
    healthAdvice: [
      'Unusually sensitive individuals should consider reducing prolonged outdoor exertion.',
      'Most people can enjoy outdoor activities normally.',
      'Keep windows open for ventilation.',
    ],
  };
  if (aqi <= 150) return {
    label: 'Unhealthy for Sensitive Groups',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    ringColor: 'stroke-orange-500',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    healthAdvice: [
      'People with respiratory or heart conditions should limit prolonged outdoor exertion.',
      'Consider wearing an N95 mask if outdoors for extended periods.',
      'Keep windows closed and use air purifiers indoors.',
      'Reduce intensity of outdoor exercise.',
    ],
  };
  if (aqi <= 200) return {
    label: 'Unhealthy',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    ringColor: 'stroke-red-500',
    description: 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.',
    healthAdvice: [
      'Avoid prolonged outdoor exertion.',
      'Wear an N95/KN95 mask when outdoors.',
      'Keep all windows and doors closed.',
      'Use air purifiers with HEPA filters indoors.',
      'Consider rescheduling outdoor sightseeing.',
    ],
  };
  if (aqi <= 300) return {
    label: 'Very Unhealthy',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    ringColor: 'stroke-purple-500',
    description: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
    healthAdvice: [
      'Avoid all outdoor activities if possible.',
      'Wear N95/KN95 masks anytime you go outside.',
      'Seal windows and doors; run air purifiers continuously.',
      'Consider changing travel plans to avoid this area.',
      'Seek medical attention if experiencing breathing difficulties.',
    ],
  };
  return {
    label: 'Hazardous',
    color: 'text-rose-800',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-800',
    ringColor: 'stroke-rose-700',
    description: 'Health alert: everyone may experience serious health effects.',
    healthAdvice: [
      'Do not go outdoors unless absolutely necessary.',
      'Evacuate the area if possible.',
      'Use N95/KN95 masks even indoors if air purification is unavailable.',
      'Seek medical attention for any respiratory symptoms.',
      'Strongly consider changing travel destination.',
    ],
  };
};

const cities: CityAQI[] = [
  {
    id: 'tokyo', city: 'Tokyo', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}',
    aqi: 42, pm25: 12.3, pm10: 28.1, ozone: 34, no2: 18, co: 0.4,
    temperature: 18, humidity: 62, lastUpdated: '10 min ago',
    trend: [38, 41, 45, 48, 52, 49, 46, 43, 40, 38, 35, 33, 36, 39, 42, 45, 48, 50, 47, 44, 41, 39, 40, 42],
  },
  {
    id: 'paris', city: 'Paris', country: 'France', flag: '\u{1F1EB}\u{1F1F7}',
    aqi: 68, pm25: 22.1, pm10: 35.4, ozone: 42, no2: 31, co: 0.6,
    temperature: 14, humidity: 71, lastUpdated: '15 min ago',
    trend: [55, 58, 62, 65, 70, 74, 78, 75, 72, 68, 65, 62, 58, 60, 63, 66, 69, 72, 70, 68, 66, 64, 66, 68],
  },
  {
    id: 'delhi', city: 'New Delhi', country: 'India', flag: '\u{1F1EE}\u{1F1F3}',
    aqi: 185, pm25: 98.5, pm10: 156.2, ozone: 65, no2: 58, co: 1.8,
    temperature: 32, humidity: 45, lastUpdated: '5 min ago',
    trend: [160, 168, 175, 182, 190, 195, 198, 192, 188, 185, 180, 175, 170, 174, 178, 182, 186, 190, 188, 185, 182, 180, 183, 185],
  },
  {
    id: 'zurich', city: 'Zurich', country: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}',
    aqi: 22, pm25: 5.8, pm10: 12.3, ozone: 18, no2: 10, co: 0.2,
    temperature: 10, humidity: 58, lastUpdated: '20 min ago',
    trend: [20, 22, 24, 25, 26, 24, 22, 20, 18, 17, 16, 18, 20, 22, 24, 25, 23, 21, 19, 18, 20, 21, 22, 22],
  },
  {
    id: 'beijing', city: 'Beijing', country: 'China', flag: '\u{1F1E8}\u{1F1F3}',
    aqi: 158, pm25: 82.4, pm10: 120.8, ozone: 58, no2: 52, co: 1.5,
    temperature: 22, humidity: 38, lastUpdated: '8 min ago',
    trend: [140, 148, 155, 162, 168, 172, 175, 170, 165, 160, 155, 150, 148, 152, 156, 160, 164, 168, 165, 162, 158, 155, 156, 158],
  },
  {
    id: 'reykjavik', city: 'Reykjavik', country: 'Iceland', flag: '\u{1F1EE}\u{1F1F8}',
    aqi: 12, pm25: 3.1, pm10: 8.2, ozone: 10, no2: 5, co: 0.1,
    temperature: 4, humidity: 78, lastUpdated: '12 min ago',
    trend: [10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 11, 12, 12],
  },
  {
    id: 'bangkok', city: 'Bangkok', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}',
    aqi: 112, pm25: 55.3, pm10: 78.6, ozone: 48, no2: 38, co: 1.1,
    temperature: 34, humidity: 80, lastUpdated: '7 min ago',
    trend: [95, 100, 105, 110, 115, 118, 120, 116, 112, 108, 104, 100, 98, 102, 106, 110, 114, 118, 116, 112, 108, 106, 110, 112],
  },
];

const bestAirCities = [
  { city: 'Reykjavik', country: 'Iceland', flag: '\u{1F1EE}\u{1F1F8}', aqi: 12, bestMonth: 'Year-round' },
  { city: 'Zurich', country: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}', aqi: 22, bestMonth: 'Jun - Sep' },
  { city: 'Helsinki', country: 'Finland', flag: '\u{1F1EB}\u{1F1EE}', aqi: 18, bestMonth: 'May - Aug' },
  { city: 'Wellington', country: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}', aqi: 15, bestMonth: 'Dec - Mar' },
  { city: 'Vancouver', country: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', aqi: 25, bestMonth: 'Apr - Sep' },
];

const tripWarnings = [
  { trip: 'Delhi Food Tour', city: 'New Delhi', aqi: 185, date: 'Mar 22 - Mar 26' },
  { trip: 'Beijing Heritage Walk', city: 'Beijing', aqi: 158, date: 'Apr 5 - Apr 10' },
  { trip: 'Bangkok Street Food', city: 'Bangkok', aqi: 112, date: 'Apr 15 - Apr 20' },
];

const cleanAirTips = [
  { title: 'Visit coastal cities in summer', description: 'Sea breezes help disperse pollutants, making coastal destinations cleaner during warmer months.' },
  { title: 'Travel after rainfall', description: 'Rain washes pollutants from the air. The day after rain typically has the best air quality.' },
  { title: 'Avoid winter in northern cities', description: 'Heating season in cities like Beijing and Delhi causes AQI spikes from November to February.' },
  { title: 'Check AQI before morning activities', description: 'Air quality often worsens during morning rush hour. Plan outdoor activities for midday or afternoon.' },
  { title: 'Pack an N95 mask', description: 'Always carry a quality mask when traveling to cities with moderate or worse air quality ratings.' },
];

const pollutantInfo = [
  { name: 'PM2.5', icon: Droplets, unit: '\u00B5g/m\u00B3', color: 'from-blue-500 to-blue-700', safe: 15 },
  { name: 'PM10', icon: Wind, unit: '\u00B5g/m\u00B3', color: 'from-cyan-500 to-cyan-700', safe: 45 },
  { name: 'Ozone', icon: ThermometerSun, unit: 'ppb', color: 'from-amber-500 to-amber-700', safe: 50 },
  { name: 'NO2', icon: Activity, unit: 'ppb', color: 'from-purple-500 to-purple-700', safe: 40 },
  { name: 'CO', icon: AlertCircle, unit: 'mg/m\u00B3', color: 'from-gray-500 to-gray-700', safe: 1.0 },
];

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ──────────────── Component ──────────────── */

export default function AirQualityPage() {
  const [selectedCity, setSelectedCity] = useState('tokyo');
  const [search, setSearch] = useState('');

  const city = cities.find((c) => c.id === selectedCity) || cities[0];
  const level = getAQILevel(city.aqi);

  const filteredCities = search
    ? cities.filter(
        (c) =>
          c.city.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase())
      )
    : cities;

  const aqiPercentage = Math.min((city.aqi / 300) * 100, 100);

  // SVG ring parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (aqiPercentage / 100) * circumference;

  // Trend chart dimensions
  const chartWidth = 100;
  const chartHeight = 40;
  const trendMax = Math.max(...city.trend);
  const trendMin = Math.min(...city.trend);
  const trendRange = trendMax - trendMin || 1;
  const trendPoints = city.trend
    .map((val, i) => {
      const x = (i / (city.trend.length - 1)) * chartWidth;
      const y = chartHeight - ((val - trendMin) / trendRange) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-[#1A3C5E]">Air Quality Monitor</h1>
        <p className="text-gray-500 mt-1">Track air quality for healthier travel decisions</p>
      </motion.div>

      {/* Search + Location */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-1.5 shrink-0">
            <MapPin className="w-4 h-4" />
            Current Location
          </Button>
        </div>
        {search && (
          <div className="mt-2 flex flex-wrap gap-2">
            {filteredCities.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCity(c.id); setSearch(''); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <span>{c.flag}</span> {c.city}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* City Selector Pills */}
      <motion.div {...fadeIn} transition={{ delay: 0.12 }}>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCity(c.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                selectedCity === c.id
                  ? 'bg-[#1A3C5E] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <span>{c.flag}</span> {c.city}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Big AQI Display */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <Card className={cn('border-2', level.bgColor)}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* AQI Ring */}
              <div className="relative w-48 h-48 shrink-0">
                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <motion.circle
                    cx="80" cy="80" r={radius} fill="none"
                    className={level.ringColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.p
                    className={cn('text-5xl font-bold', level.color)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    {city.aqi}
                  </motion.p>
                  <p className="text-xs text-gray-500 mt-1">AQI</p>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-[#1A3C5E]">{city.flag} {city.city}</h2>
                  <Badge className={cn('text-sm', level.bgColor, level.textColor)}>{level.label}</Badge>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">{level.description}</p>
                <div className="flex items-center gap-6 justify-center md:justify-start text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <ThermometerSun className="w-4 h-4" />
                    {city.temperature}\u00B0C
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" />
                    {city.humidity}% humidity
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Updated {city.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pollutant Breakdown */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#E8733A]" />
          Pollutant Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pollutantInfo.map((pollutant, index) => {
            const value = pollutant.name === 'PM2.5' ? city.pm25
              : pollutant.name === 'PM10' ? city.pm10
              : pollutant.name === 'Ozone' ? city.ozone
              : pollutant.name === 'NO2' ? city.no2
              : city.co;
            const ratio = Math.min(value / (pollutant.safe * 3), 1);
            const isHigh = value > pollutant.safe;
            return (
              <motion.div
                key={pollutant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
              >
                <Card className={cn('hover:shadow-md transition-shadow', isHigh && 'border-red-200')}>
                  <CardContent className="p-4 text-center">
                    <div className={cn('w-10 h-10 rounded-full bg-gradient-to-br mx-auto mb-2 flex items-center justify-center', pollutant.color)}>
                      <pollutant.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{pollutant.name}</p>
                    <p className={cn('text-2xl font-bold mt-1', isHigh ? 'text-red-600' : 'text-[#1A3C5E]')}>
                      {value}
                    </p>
                    <p className="text-[10px] text-gray-400">{pollutant.unit}</p>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ratio * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                        className={cn('h-full rounded-full', isHigh ? 'bg-red-500' : 'bg-green-500')}
                      />
                    </div>
                    <p className="text-[10px] mt-1 text-gray-400">Safe: &lt;{pollutant.safe}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Health Recommendations */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <Card className={cn('border', level.bgColor)}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Health Recommendations
              <Badge className={cn('ml-2', level.bgColor, level.textColor)}>{level.label}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {level.healthAdvice.map((advice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E8733A]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-3.5 h-3.5 text-[#E8733A]" />
                  </div>
                  <p className="text-sm text-gray-600">{advice}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Historical Trend */}
      <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E8733A]" />
              24-Hour Trend - {city.city}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-xl">
              <svg viewBox={`-5 -5 ${chartWidth + 10} ${chartHeight + 20}`} className="w-full h-32">
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                  <line
                    key={pct}
                    x1="0" y1={chartHeight * (1 - pct)}
                    x2={chartWidth} y2={chartHeight * (1 - pct)}
                    stroke="#e5e7eb" strokeWidth="0.3"
                  />
                ))}
                {/* Trend line */}
                <motion.polyline
                  points={trendPoints}
                  fill="none"
                  stroke="#E8733A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                {/* Dots at start and end */}
                <circle cx={0} cy={chartHeight - ((city.trend[0] - trendMin) / trendRange) * chartHeight} r="2" fill="#1A3C5E" />
                <circle
                  cx={chartWidth}
                  cy={chartHeight - ((city.trend[city.trend.length - 1] - trendMin) / trendRange) * chartHeight}
                  r="2.5" fill="#E8733A"
                />
                {/* Labels */}
                <text x="0" y={chartHeight + 12} fontSize="3.5" fill="#9ca3af">24h ago</text>
                <text x={chartWidth - 8} y={chartHeight + 12} fontSize="3.5" fill="#9ca3af">Now</text>
                <text x="-4" y="3" fontSize="3" fill="#9ca3af">{trendMax}</text>
                <text x="-4" y={chartHeight + 3} fontSize="3" fill="#9ca3af">{trendMin}</text>
              </svg>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-gray-500">
                Range: <span className="font-medium text-[#1A3C5E]">{trendMin} - {trendMax} AQI</span>
              </span>
              <span className="text-gray-500">
                Current: <span className={cn('font-medium', level.color)}>{city.aqi} AQI</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Air Quality Cities */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Best Air Quality Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bestAirCities.map((c, index) => (
                  <motion.div
                    key={c.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-green-50/50 border border-green-100 hover:border-green-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                        {c.flag}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1A3C5E]">{c.city}</p>
                        <p className="text-[10px] text-gray-500">{c.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700 text-xs">AQI {c.aqi}</Badge>
                      <p className="text-[10px] text-gray-400 mt-1">Best: {c.bestMonth}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trip Air Quality Warnings */}
        <motion.div {...fadeIn} transition={{ delay: 0.45 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Trip Air Quality Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tripWarnings.map((warning, index) => {
                  const warnLevel = getAQILevel(warning.aqi);
                  return (
                    <motion.div
                      key={warning.trip}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className={cn('p-4 rounded-xl border', warnLevel.bgColor)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm text-[#1A3C5E]">{warning.trip}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{warning.city} - {warning.date}</p>
                        </div>
                        <Badge className={cn(warnLevel.bgColor, warnLevel.textColor)}>
                          AQI {warning.aqi}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{warnLevel.description}</p>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-[#1A3C5E]/5 rounded-xl">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Warnings are based on current AQI. Conditions may change before your trip.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tips: Best Time to Visit for Clean Air */}
      <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wind className="w-5 h-5 text-[#1A3C5E]" />
              Tips: Best Time to Visit for Clean Air
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cleanAirTips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + index * 0.05 }}
                  className="p-4 rounded-xl border border-gray-100 hover:border-[#E8733A]/30 hover:bg-[#E8733A]/5 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E8733A]/10 flex items-center justify-center shrink-0">
                      <Leaf className="w-4 h-4 text-[#E8733A]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1A3C5E]">{tip.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
