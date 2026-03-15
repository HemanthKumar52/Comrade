'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, PartyPopper, Palmtree, Clock, Globe, Star,
  ChevronLeft, ChevronRight, Gift, Sun, Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface Holiday {
  date: string;
  name: string;
  type: 'public' | 'bank' | 'observance';
  isLongWeekend: boolean;
  longWeekendDays?: number;
  description?: string;
}

interface CountryHolidays {
  country: string;
  code: string;
  flag: string;
  holidays: Holiday[];
}

/* ──────────────── Mock Data ──────────────── */

const holidayData: Record<string, Record<number, CountryHolidays>> = {
  IN: {
    2026: {
      country: 'India',
      code: 'IN',
      flag: '🇮🇳',
      holidays: [
        { date: '2026-01-26', name: 'Republic Day', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Celebrates the adoption of the Indian Constitution' },
        { date: '2026-03-10', name: 'Maha Shivaratri', type: 'public', isLongWeekend: false, description: 'Hindu festival dedicated to Lord Shiva' },
        { date: '2026-03-17', name: 'Holi', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Festival of colors celebrating spring' },
        { date: '2026-03-31', name: 'Id-ul-Fitr', type: 'public', isLongWeekend: false, description: 'End of Ramadan celebrations' },
        { date: '2026-04-02', name: 'Good Friday', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Christian observance of the crucifixion of Jesus' },
        { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti', type: 'public', isLongWeekend: false, description: 'Birth anniversary of Dr. B.R. Ambedkar' },
        { date: '2026-05-01', name: 'May Day', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'International Workers Day' },
        { date: '2026-05-25', name: 'Buddha Purnima', type: 'public', isLongWeekend: false, description: 'Birth anniversary of Gautama Buddha' },
        { date: '2026-06-07', name: 'Eid ul-Adha', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Festival of sacrifice' },
        { date: '2026-07-07', name: 'Muharram', type: 'public', isLongWeekend: false, description: 'Islamic New Year' },
        { date: '2026-08-15', name: 'Independence Day', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Celebrates independence from British rule in 1947' },
        { date: '2026-08-25', name: 'Janmashtami', type: 'public', isLongWeekend: false, description: 'Birth anniversary of Lord Krishna' },
        { date: '2026-09-05', name: 'Milad-un-Nabi', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Birthday of Prophet Muhammad' },
        { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Birth anniversary of Mahatma Gandhi' },
        { date: '2026-10-20', name: 'Dussehra', type: 'public', isLongWeekend: false, description: 'Victory of good over evil' },
        { date: '2026-11-08', name: 'Diwali', type: 'public', isLongWeekend: true, longWeekendDays: 4, description: 'Festival of lights, one of the biggest festivals in India' },
        { date: '2026-11-09', name: 'Govardhan Puja', type: 'observance', isLongWeekend: false, description: 'Day after Diwali, worship of Govardhan Hill' },
        { date: '2026-11-19', name: 'Guru Nanak Jayanti', type: 'public', isLongWeekend: false, description: 'Birth anniversary of Guru Nanak' },
        { date: '2026-12-25', name: 'Christmas', type: 'public', isLongWeekend: true, longWeekendDays: 3, description: 'Celebrates the birth of Jesus Christ' },
      ],
    },
    2027: {
      country: 'India',
      code: 'IN',
      flag: '🇮🇳',
      holidays: [
        { date: '2027-01-26', name: 'Republic Day', type: 'public', isLongWeekend: false, description: 'Celebrates the adoption of the Indian Constitution' },
        { date: '2027-02-27', name: 'Maha Shivaratri', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-03-08', name: 'Holi', type: 'public', isLongWeekend: false, description: 'Festival of colors celebrating spring' },
        { date: '2027-03-20', name: 'Id-ul-Fitr', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-04-02', name: 'Good Friday', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-04-14', name: 'Dr. Ambedkar Jayanti', type: 'public', isLongWeekend: false },
        { date: '2027-05-14', name: 'Buddha Purnima', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-05-28', name: 'Eid ul-Adha', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-08-15', name: 'Independence Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-10-02', name: 'Gandhi Jayanti', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-10-09', name: 'Dussehra', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-10-29', name: 'Diwali', type: 'public', isLongWeekend: true, longWeekendDays: 4 },
        { date: '2027-11-08', name: 'Guru Nanak Jayanti', type: 'public', isLongWeekend: false },
        { date: '2027-12-25', name: 'Christmas', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
      ],
    },
  },
  US: {
    2026: {
      country: 'United States',
      code: 'US',
      flag: '🇺🇸',
      holidays: [
        { date: '2026-01-01', name: "New Year's Day", type: 'public', isLongWeekend: false },
        { date: '2026-01-19', name: 'Martin Luther King Jr. Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-02-16', name: "Presidents' Day", type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-05-25', name: 'Memorial Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-07-04', name: 'Independence Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-09-07', name: 'Labor Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-10-12', name: 'Columbus Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-11-11', name: 'Veterans Day', type: 'public', isLongWeekend: false },
        { date: '2026-11-26', name: 'Thanksgiving', type: 'public', isLongWeekend: true, longWeekendDays: 4 },
        { date: '2026-12-25', name: 'Christmas Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
      ],
    },
    2027: {
      country: 'United States',
      code: 'US',
      flag: '🇺🇸',
      holidays: [
        { date: '2027-01-01', name: "New Year's Day", type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-01-18', name: 'Martin Luther King Jr. Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-02-15', name: "Presidents' Day", type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-05-31', name: 'Memorial Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-07-04', name: 'Independence Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-09-06', name: 'Labor Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-11-25', name: 'Thanksgiving', type: 'public', isLongWeekend: true, longWeekendDays: 4 },
        { date: '2027-12-25', name: 'Christmas Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
      ],
    },
  },
  JP: {
    2026: {
      country: 'Japan',
      code: 'JP',
      flag: '🇯🇵',
      holidays: [
        { date: '2026-01-01', name: "New Year's Day", type: 'public', isLongWeekend: false },
        { date: '2026-01-12', name: 'Coming of Age Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-02-11', name: 'National Foundation Day', type: 'public', isLongWeekend: false },
        { date: '2026-02-23', name: "Emperor's Birthday", type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-03-20', name: 'Vernal Equinox Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-04-29', name: 'Showa Day', type: 'public', isLongWeekend: false },
        { date: '2026-05-03', name: 'Constitution Memorial Day', type: 'public', isLongWeekend: true, longWeekendDays: 5, description: 'Golden Week' },
        { date: '2026-05-04', name: 'Greenery Day', type: 'public', isLongWeekend: true, longWeekendDays: 5, description: 'Golden Week' },
        { date: '2026-05-05', name: "Children's Day", type: 'public', isLongWeekend: true, longWeekendDays: 5, description: 'Golden Week' },
        { date: '2026-07-20', name: 'Marine Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-08-11', name: 'Mountain Day', type: 'public', isLongWeekend: false },
        { date: '2026-09-21', name: 'Respect for the Aged Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-09-23', name: 'Autumnal Equinox Day', type: 'public', isLongWeekend: false },
        { date: '2026-10-12', name: 'Sports Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2026-11-03', name: 'Culture Day', type: 'public', isLongWeekend: false },
        { date: '2026-11-23', name: 'Labor Thanksgiving Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
      ],
    },
    2027: {
      country: 'Japan',
      code: 'JP',
      flag: '🇯🇵',
      holidays: [
        { date: '2027-01-01', name: "New Year's Day", type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-01-11', name: 'Coming of Age Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-02-11', name: 'National Foundation Day', type: 'public', isLongWeekend: false },
        { date: '2027-02-23', name: "Emperor's Birthday", type: 'public', isLongWeekend: false },
        { date: '2027-05-03', name: 'Constitution Memorial Day', type: 'public', isLongWeekend: true, longWeekendDays: 5 },
        { date: '2027-07-19', name: 'Marine Day', type: 'public', isLongWeekend: true, longWeekendDays: 3 },
        { date: '2027-11-03', name: 'Culture Day', type: 'public', isLongWeekend: false },
        { date: '2027-11-23', name: 'Labor Thanksgiving Day', type: 'public', isLongWeekend: false },
      ],
    },
  },
};

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

const typeStyles: Record<string, string> = {
  public: 'bg-green-100 text-green-700',
  bank: 'bg-blue-100 text-blue-700',
  observance: 'bg-purple-100 text-purple-700',
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* ──────────────── Helpers ──────────────── */

function daysUntil(dateStr: string): number {
  const today = new Date('2026-03-15');
  const target = new Date(dateStr);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/* ──────────────── Component ──────────────── */

export default function HolidaysPage() {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [view, setView] = useState<'cards' | 'calendar'>('cards');
  const [calendarMonth, setCalendarMonth] = useState(2); // March (0-indexed)

  const data = holidayData[selectedCountry]?.[selectedYear];
  const holidays = data?.holidays ?? [];

  const upcomingHolidays = useMemo(() => {
    return holidays
      .filter((h) => daysUntil(h.date) > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [holidays]);

  const longWeekends = useMemo(() => {
    return holidays.filter((h) => h.isLongWeekend);
  }, [holidays]);

  const holidayDatesInMonth = useMemo(() => {
    const set = new Set<number>();
    holidays.forEach((h) => {
      const d = new Date(h.date);
      if (d.getFullYear() === selectedYear && d.getMonth() === calendarMonth) {
        set.add(d.getDate());
      }
    });
    return set;
  }, [holidays, calendarMonth, selectedYear]);

  const holidayNameForDate = (day: number): string | undefined => {
    const h = holidays.find((h) => {
      const d = new Date(h.date);
      return d.getFullYear() === selectedYear && d.getMonth() === calendarMonth && d.getDate() === day;
    });
    return h?.name;
  };

  const daysInMonth = getDaysInMonth(selectedYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, calendarMonth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E]">Holidays</h1>
        <p className="text-gray-500 text-sm mt-1">Discover holidays and plan trips around long weekends</p>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
        >
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
        <div className="flex gap-2 sm:ml-auto">
          <Button
            variant={view === 'cards' ? 'default' : 'outline'}
            className={cn(view === 'cards' ? 'bg-[#1A3C5E] hover:bg-[#153350] text-white' : '')}
            onClick={() => setView('cards')}
          >
            <Calendar className="w-4 h-4 mr-2" /> Cards
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            className={cn(view === 'calendar' ? 'bg-[#1A3C5E] hover:bg-[#153350] text-white' : '')}
            onClick={() => setView('calendar')}
          >
            <Globe className="w-4 h-4 mr-2" /> Calendar
          </Button>
        </div>
      </motion.div>

      {/* Stats Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Holidays', value: holidays.length, icon: PartyPopper, color: 'bg-blue-50 text-blue-600' },
            { label: 'Public Holidays', value: holidays.filter((h) => h.type === 'public').length, icon: Star, color: 'bg-green-50 text-green-600' },
            { label: 'Long Weekends', value: longWeekends.length, icon: Palmtree, color: 'bg-orange-50 text-[#E8733A]' },
            { label: 'Days Until Next', value: upcomingHolidays[0] ? daysUntil(upcomingHolidays[0].date) : '--', icon: Clock, color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A3C5E]">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Holidays Countdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E8733A]" />
              Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingHolidays.map((holiday, i) => {
                const days = daysUntil(holiday.date);
                return (
                  <motion.div
                    key={holiday.date + holiday.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-[#1A3C5E]/5 transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#1A3C5E] text-white flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-medium opacity-80">{new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-bold leading-tight">{new Date(holiday.date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1A3C5E] truncate">{holiday.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(holiday.date)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {holiday.isLongWeekend && (
                        <Badge className="bg-[#E8733A] text-white text-xs">
                          <Palmtree className="w-3 h-3 mr-1" /> {holiday.longWeekendDays}d weekend
                        </Badge>
                      )}
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#E8733A]">{days}</p>
                        <p className="text-[10px] text-gray-400">days left</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {upcomingHolidays.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming holidays for this selection</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Long Weekends Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-[#E8733A] via-[#e8843a] to-[#d4622e] p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Palmtree className="w-5 h-5" />
              <h2 className="text-lg font-bold">Long Weekends for Trip Planning</h2>
            </div>
            <p className="text-sm opacity-90">Plan your trips around these extended breaks</p>
          </div>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {longWeekends.map((holiday, i) => (
                <motion.div
                  key={holiday.date + holiday.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="p-4 rounded-xl border-2 border-[#E8733A]/20 bg-orange-50/50 hover:border-[#E8733A]/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-[#1A3C5E]">{holiday.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(holiday.date)}</p>
                    </div>
                    <Badge className="bg-[#E8733A] text-white shrink-0">
                      {holiday.longWeekendDays} days
                    </Badge>
                  </div>
                  {holiday.description && (
                    <p className="text-xs text-gray-500 mt-1">{holiday.description}</p>
                  )}
                  <Button variant="outline" size="sm" className="mt-3 text-xs border-[#E8733A]/30 text-[#E8733A] hover:bg-[#E8733A]/10">
                    <Sparkles className="w-3 h-3 mr-1" /> Plan a Trip
                  </Button>
                </motion.div>
              ))}
            </div>
            {longWeekends.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No long weekends found for this selection</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Cards View / Calendar View */}
      {view === 'cards' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">All Holidays in {selectedYear}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {holidays.map((holiday, i) => (
              <motion.div
                key={holiday.date + holiday.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.03 }}
              >
                <Card className="hover:shadow-md transition-all h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#1A3C5E]/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-medium text-[#1A3C5E]">{new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-lg font-bold leading-tight text-[#1A3C5E]">{new Date(holiday.date).getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A3C5E] truncate">{holiday.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(holiday.date)}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={cn('text-xs', typeStyles[holiday.type])}>
                            {holiday.type}
                          </Badge>
                          {holiday.isLongWeekend && (
                            <Badge className="bg-[#E8733A]/10 text-[#E8733A] text-xs">
                              <Palmtree className="w-3 h-3 mr-1" /> Long Weekend
                            </Badge>
                          )}
                        </div>
                        {holiday.description && (
                          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{holiday.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {monthNames[calendarMonth]} {selectedYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarMonth((p) => (p > 0 ? p - 1 : 11))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarMonth((p) => (p < 11 ? p + 1 : 0))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-16" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isHoliday = holidayDatesInMonth.has(day);
                  const name = holidayNameForDate(day);
                  const isToday = selectedYear === 2026 && calendarMonth === 2 && day === 15;
                  return (
                    <div
                      key={day}
                      className={cn(
                        'h-16 rounded-lg p-1 text-center border transition-all relative',
                        isHoliday ? 'bg-[#E8733A]/10 border-[#E8733A]/30' : 'border-gray-100 hover:bg-gray-50',
                        isToday && 'ring-2 ring-[#1A3C5E]'
                      )}
                      title={name}
                    >
                      <span className={cn(
                        'text-sm font-medium',
                        isHoliday ? 'text-[#E8733A] font-bold' : 'text-gray-700',
                        isToday && 'text-[#1A3C5E]'
                      )}>
                        {day}
                      </span>
                      {isHoliday && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <p className="text-[8px] font-semibold text-[#E8733A] truncate leading-tight">{name}</p>
                        </div>
                      )}
                      {isToday && (
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#1A3C5E] rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-[#E8733A]/10 border border-[#E8733A]/30" />
                  Holiday
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded ring-2 ring-[#1A3C5E]" />
                  Today
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
