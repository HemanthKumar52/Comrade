'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Eye, Thermometer,
  Sunrise, Sunset, Camera, AlertTriangle, MapPin, Search, LocateFixed,
  CloudLightning, CloudDrizzle, Gauge,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const weatherEmojis: Record<string, string> = {
  sunny: '☀️', partlyCloudy: '🌤️', cloudy: '⛅', rainy: '🌧️', stormy: '⛈️', snowy: '❄️', foggy: '🌫️',
};

interface CurrentWeather {
  temp: number;
  feelsLike: number;
  description: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: string;
  visibility: number;
}

const mockCurrent: CurrentWeather = {
  temp: 28,
  feelsLike: 31,
  description: 'Partly Cloudy',
  condition: 'partlyCloudy',
  humidity: 72,
  windSpeed: 14,
  uvIndex: 7,
  airQuality: 'Moderate',
  visibility: 8,
};

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  rainChance: number;
}

const mockForecast: ForecastDay[] = [
  { day: 'Mon', high: 30, low: 24, condition: 'sunny', rainChance: 10 },
  { day: 'Tue', high: 29, low: 23, condition: 'partlyCloudy', rainChance: 25 },
  { day: 'Wed', high: 27, low: 22, condition: 'rainy', rainChance: 80 },
  { day: 'Thu', high: 26, low: 21, condition: 'stormy', rainChance: 90 },
  { day: 'Fri', high: 28, low: 23, condition: 'cloudy', rainChance: 40 },
];

const alerts = [
  { type: 'warning', title: 'Heavy Rain Warning', description: 'Heavy rainfall expected Wednesday-Thursday. Possible waterlogging in low-lying areas.', severity: 'amber' },
];

interface MonthWeather {
  month: string;
  avgTemp: number;
  rainfall: 'Low' | 'Medium' | 'High';
  best: boolean;
}

const bestTimeData: Record<string, MonthWeather[]> = {
  India: [
    { month: 'Jan', avgTemp: 20, rainfall: 'Low', best: true },
    { month: 'Feb', avgTemp: 22, rainfall: 'Low', best: true },
    { month: 'Mar', avgTemp: 28, rainfall: 'Low', best: true },
    { month: 'Apr', avgTemp: 33, rainfall: 'Low', best: false },
    { month: 'May', avgTemp: 36, rainfall: 'Low', best: false },
    { month: 'Jun', avgTemp: 34, rainfall: 'High', best: false },
    { month: 'Jul', avgTemp: 30, rainfall: 'High', best: false },
    { month: 'Aug', avgTemp: 29, rainfall: 'High', best: false },
    { month: 'Sep', avgTemp: 29, rainfall: 'High', best: false },
    { month: 'Oct', avgTemp: 28, rainfall: 'Medium', best: true },
    { month: 'Nov', avgTemp: 24, rainfall: 'Low', best: true },
    { month: 'Dec', avgTemp: 20, rainfall: 'Low', best: true },
  ],
  Japan: [
    { month: 'Jan', avgTemp: 5, rainfall: 'Low', best: false },
    { month: 'Feb', avgTemp: 6, rainfall: 'Low', best: false },
    { month: 'Mar', avgTemp: 10, rainfall: 'Medium', best: true },
    { month: 'Apr', avgTemp: 15, rainfall: 'Medium', best: true },
    { month: 'May', avgTemp: 20, rainfall: 'Medium', best: true },
    { month: 'Jun', avgTemp: 23, rainfall: 'High', best: false },
    { month: 'Jul', avgTemp: 27, rainfall: 'High', best: false },
    { month: 'Aug', avgTemp: 28, rainfall: 'Medium', best: false },
    { month: 'Sep', avgTemp: 24, rainfall: 'Medium', best: false },
    { month: 'Oct', avgTemp: 18, rainfall: 'Medium', best: true },
    { month: 'Nov', avgTemp: 13, rainfall: 'Low', best: true },
    { month: 'Dec', avgTemp: 7, rainfall: 'Low', best: false },
  ],
  Thailand: [
    { month: 'Jan', avgTemp: 27, rainfall: 'Low', best: true },
    { month: 'Feb', avgTemp: 29, rainfall: 'Low', best: true },
    { month: 'Mar', avgTemp: 30, rainfall: 'Low', best: true },
    { month: 'Apr', avgTemp: 31, rainfall: 'Medium', best: false },
    { month: 'May', avgTemp: 30, rainfall: 'High', best: false },
    { month: 'Jun', avgTemp: 29, rainfall: 'High', best: false },
    { month: 'Jul', avgTemp: 29, rainfall: 'High', best: false },
    { month: 'Aug', avgTemp: 29, rainfall: 'High', best: false },
    { month: 'Sep', avgTemp: 28, rainfall: 'High', best: false },
    { month: 'Oct', avgTemp: 28, rainfall: 'High', best: false },
    { month: 'Nov', avgTemp: 27, rainfall: 'Medium', best: true },
    { month: 'Dec', avgTemp: 26, rainfall: 'Low', best: true },
  ],
};

const rainfallColor: Record<string, string> = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-blue-100 text-blue-700',
};

const uvLabel = (uv: number) => {
  if (uv <= 2) return { text: 'Low', color: 'text-green-600' };
  if (uv <= 5) return { text: 'Moderate', color: 'text-yellow-600' };
  if (uv <= 7) return { text: 'High', color: 'text-orange-600' };
  if (uv <= 10) return { text: 'Very High', color: 'text-red-600' };
  return { text: 'Extreme', color: 'text-purple-600' };
};

export default function WeatherPage() {
  const [location, setLocation] = useState('Mumbai, India');
  const [bestTimeCountry, setBestTimeCountry] = useState('India');
  const uv = uvLabel(mockCurrent.uvIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E]">Weather</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time weather and travel planning</p>
      </motion.div>

      {/* Location Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or destination..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
          />
        </div>
        <Button className="bg-[#1A3C5E] hover:bg-[#153350] text-white gap-2 h-11 shrink-0">
          <LocateFixed className="w-4 h-4" /> Use Current Location
        </Button>
      </motion.div>

      {/* Current Weather Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-[#1A3C5E] via-[#2a5a8a] to-[#3a7ab8] text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                  <MapPin className="w-4 h-4 opacity-80" />
                  <span className="text-sm opacity-80">{location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-7xl sm:text-8xl">{weatherEmojis[mockCurrent.condition]}</span>
                  <div>
                    <p className="text-5xl sm:text-6xl font-bold">{mockCurrent.temp}°C</p>
                    <p className="text-lg opacity-90">{mockCurrent.description}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 sm:ml-auto">
                <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <Thermometer className="w-4 h-4 mx-auto mb-1 opacity-80" />
                  <p className="text-xs opacity-70">Feels Like</p>
                  <p className="font-bold">{mockCurrent.feelsLike}°C</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <Droplets className="w-4 h-4 mx-auto mb-1 opacity-80" />
                  <p className="text-xs opacity-70">Humidity</p>
                  <p className="font-bold">{mockCurrent.humidity}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <Wind className="w-4 h-4 mx-auto mb-1 opacity-80" />
                  <p className="text-xs opacity-70">Wind</p>
                  <p className="font-bold">{mockCurrent.windSpeed} km/h</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <Sun className="w-4 h-4 mx-auto mb-1 opacity-80" />
                  <p className="text-xs opacity-70">UV Index</p>
                  <p className="font-bold">{mockCurrent.uvIndex} ({uv.text})</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <Gauge className="w-4 h-4 mx-auto mb-1 opacity-80" />
                  <p className="text-xs opacity-70">Air Quality</p>
                  <p className="font-bold">{mockCurrent.airQuality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <Eye className="w-4 h-4 mx-auto mb-1 opacity-80" />
                  <p className="text-xs opacity-70">Visibility</p>
                  <p className="font-bold">{mockCurrent.visibility} km</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 5-Day Forecast */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">5-Day Forecast</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {mockForecast.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="shrink-0"
            >
              <Card className="w-28 sm:w-32 hover:shadow-md transition-all">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-2">{day.day}</p>
                  <span className="text-3xl block mb-2">{weatherEmojis[day.condition]}</span>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-sm font-bold text-[#1A3C5E]">{day.high}°</span>
                    <span className="text-xs text-gray-400">/</span>
                    <span className="text-sm text-gray-400">{day.low}°</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-500">
                    <Droplets className="w-3 h-3" />
                    {day.rainChance}%
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sunrise / Sunset */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sunrise className="w-5 h-5 text-amber-500" />
                Sunrise & Sunset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-2xl">🌅</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sunrise</p>
                    <p className="text-xl font-bold text-[#1A3C5E]">6:18 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs text-gray-500 text-right">Sunset</p>
                    <p className="text-xl font-bold text-[#1A3C5E]">6:42 PM</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-2xl">🌇</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-gradient-to-r from-amber-200 via-blue-300 to-orange-300 rounded-full" />
              <p className="text-sm text-gray-500 text-center">Day length: <span className="font-semibold text-[#1A3C5E]">12h 24m</span></p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Golden Hour */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full overflow-hidden">
            <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400 p-6 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Golden Hour</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">Perfect for photography</p>
              </div>
              <div className="space-y-3">
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <p className="text-xs opacity-80">Morning Golden Hour</p>
                  <p className="text-lg font-bold">6:18 AM - 7:05 AM</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <p className="text-xs opacity-80">Evening Golden Hour</p>
                  <p className="text-lg font-bold">5:55 PM - 6:42 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">Weather Alerts</h2>
          {alerts.map((alert, i) => (
            <div key={i} className={cn(
              'p-4 rounded-xl border-2 flex items-start gap-3',
              alert.severity === 'amber' ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'
            )}>
              <AlertTriangle className={cn('w-5 h-5 shrink-0 mt-0.5', alert.severity === 'amber' ? 'text-amber-600' : 'text-red-600')} />
              <div>
                <h4 className={cn('font-bold text-sm', alert.severity === 'amber' ? 'text-amber-800' : 'text-red-800')}>
                  {alert.title}
                </h4>
                <p className={cn('text-sm mt-1', alert.severity === 'amber' ? 'text-amber-700' : 'text-red-700')}>
                  {alert.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Best Time to Visit */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg">Best Time to Visit</CardTitle>
            <select
              value={bestTimeCountry}
              onChange={(e) => setBestTimeCountry(e.target.value)}
              className="w-full sm:w-48 h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30"
            >
              {Object.keys(bestTimeData).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {bestTimeData[bestTimeCountry]?.map((m) => (
                <div
                  key={m.month}
                  className={cn(
                    'rounded-xl p-2.5 text-center border transition-all',
                    m.best
                      ? 'bg-green-50 border-green-300 ring-1 ring-green-200'
                      : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <p className="text-xs font-bold text-gray-600">{m.month}</p>
                  <p className={cn('text-lg font-bold', m.best ? 'text-green-700' : 'text-gray-700')}>
                    {m.avgTemp}°
                  </p>
                  <span className={cn('text-[9px] font-medium px-1.5 py-0.5 rounded-full', rainfallColor[m.rainfall])}>
                    {m.rainfall}
                  </span>
                  {m.best && (
                    <p className="text-[9px] font-bold text-green-600 mt-1">BEST</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Climate Zones */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Climate Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Tropical', emoji: '🌴', desc: 'Hot and humid year-round. Heavy monsoon rains. Found near the equator.', color: 'bg-green-50 border-green-200' },
                { name: 'Temperate', emoji: '🍂', desc: 'Moderate temperatures with distinct seasons. Comfortable for most activities.', color: 'bg-amber-50 border-amber-200' },
                { name: 'Arid', emoji: '🏜️', desc: 'Very dry with extreme temperature swings between day and night.', color: 'bg-orange-50 border-orange-200' },
                { name: 'Polar', emoji: '🧊', desc: 'Extremely cold with long winters and very short summers. Snow-covered.', color: 'bg-blue-50 border-blue-200' },
              ].map((zone) => (
                <div key={zone.name} className={cn('p-4 rounded-xl border', zone.color)}>
                  <span className="text-2xl">{zone.emoji}</span>
                  <h4 className="font-bold text-[#1A3C5E] mt-2">{zone.name}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{zone.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
