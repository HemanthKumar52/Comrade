'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stamp, Globe, MapPin, Calendar, Award, Share2, Plane,
  Camera, Clock, ChevronRight, Map, TrendingUp,
  HelpCircle, Star, Shield, Crown, Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Continent = 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania';

interface PassportStamp {
  id: string;
  city: string;
  country: string;
  continent: Continent;
  visitDate: string;
  departDate: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  emoji: string;
  photos: string[];
  highlights: string[];
  tripType: string;
}

/* -------------------------------------------------------------------------- */
/*  Passport tier system                                                      */
/* -------------------------------------------------------------------------- */

interface PassportTier {
  name: string;
  minStamps: number;
  icon: typeof Globe;
  color: string;
  badgeBg: string;
  description: string;
}

const tiers: PassportTier[] = [
  { name: 'Beginner Traveler', minStamps: 0, icon: Map, color: 'text-gray-400', badgeBg: 'bg-gray-100 text-gray-600', description: 'Your journey begins here' },
  { name: 'Explorer', minStamps: 5, icon: Sparkles, color: 'text-blue-400', badgeBg: 'bg-blue-100 text-blue-700', description: 'Discovering the world one city at a time' },
  { name: 'Globe Trotter', minStamps: 10, icon: Globe, color: 'text-purple-400', badgeBg: 'bg-purple-100 text-purple-700', description: 'No border can hold you back' },
  { name: 'World Citizen', minStamps: 20, icon: Crown, color: 'text-amber-400', badgeBg: 'bg-amber-100 text-amber-700', description: 'The world is your home' },
];

function getCurrentTier(stampCount: number): PassportTier {
  let current = tiers[0];
  for (const tier of tiers) {
    if (stampCount >= tier.minStamps) current = tier;
  }
  return current;
}

function getNextTier(stampCount: number): PassportTier | null {
  for (const tier of tiers) {
    if (stampCount < tier.minStamps) return tier;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const mockStamps: PassportStamp[] = [
  {
    id: '1', city: 'Tokyo', country: 'Japan', continent: 'Asia',
    visitDate: '2025-11-02', departDate: '2025-11-10',
    color: 'from-rose-400 to-red-600', bgGradient: 'bg-gradient-to-br from-rose-400 to-red-600',
    borderColor: 'border-rose-300', emoji: '\u{1F1EF}\u{1F1F5}',
    photos: ['Shibuya Crossing', 'Senso-ji Temple', 'Mount Fuji viewpoint'],
    highlights: ['Visited Akihabara', 'Ate authentic ramen in Shinjuku', 'Watched sunrise from Meiji Shrine'],
    tripType: 'Cultural',
  },
  {
    id: '2', city: 'Paris', country: 'France', continent: 'Europe',
    visitDate: '2025-09-15', departDate: '2025-09-22',
    color: 'from-blue-400 to-indigo-600', bgGradient: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    borderColor: 'border-blue-300', emoji: '\u{1F1EB}\u{1F1F7}',
    photos: ['Eiffel Tower at dusk', 'Louvre Museum', 'Seine River cruise'],
    highlights: ['Picnic at Champ de Mars', 'Explored Montmartre', 'Visited Palace of Versailles'],
    tripType: 'Romantic',
  },
  {
    id: '3', city: 'Bali', country: 'Indonesia', continent: 'Asia',
    visitDate: '2025-08-01', departDate: '2025-08-09',
    color: 'from-green-400 to-emerald-600', bgGradient: 'bg-gradient-to-br from-green-400 to-emerald-600',
    borderColor: 'border-green-300', emoji: '\u{1F1EE}\u{1F1E9}',
    photos: ['Tegallalang Rice Terraces', 'Uluwatu Temple', 'Beach sunset'],
    highlights: ['Surfing in Kuta', 'Yoga retreat in Ubud', 'Snorkeling at Nusa Penida'],
    tripType: 'Adventure',
  },
  {
    id: '4', city: 'New York', country: 'United States', continent: 'North America',
    visitDate: '2025-06-10', departDate: '2025-06-17',
    color: 'from-amber-400 to-orange-600', bgGradient: 'bg-gradient-to-br from-amber-400 to-orange-600',
    borderColor: 'border-amber-300', emoji: '\u{1F1FA}\u{1F1F8}',
    photos: ['Statue of Liberty', 'Central Park', 'Times Square at night'],
    highlights: ['Broadway show', 'Walking across Brooklyn Bridge', 'Pizza in Little Italy'],
    tripType: 'Urban',
  },
  {
    id: '5', city: 'Cape Town', country: 'South Africa', continent: 'Africa',
    visitDate: '2025-04-20', departDate: '2025-04-28',
    color: 'from-yellow-400 to-lime-600', bgGradient: 'bg-gradient-to-br from-yellow-400 to-lime-600',
    borderColor: 'border-yellow-300', emoji: '\u{1F1FF}\u{1F1E6}',
    photos: ['Table Mountain', 'Boulders Beach penguins', 'Cape of Good Hope'],
    highlights: ['Safari at Kruger', 'Wine tasting in Stellenbosch', 'Hike up Lion\'s Head'],
    tripType: 'Wildlife',
  },
  {
    id: '6', city: 'Barcelona', country: 'Spain', continent: 'Europe',
    visitDate: '2025-03-05', departDate: '2025-03-12',
    color: 'from-orange-400 to-red-500', bgGradient: 'bg-gradient-to-br from-orange-400 to-red-500',
    borderColor: 'border-orange-300', emoji: '\u{1F1EA}\u{1F1F8}',
    photos: ['Sagrada Familia', 'Park Guell', 'La Boqueria Market'],
    highlights: ['Gaudi architecture tour', 'Tapas crawl in El Born', 'Beach at Barceloneta'],
    tripType: 'Cultural',
  },
  {
    id: '7', city: 'Sydney', country: 'Australia', continent: 'Oceania',
    visitDate: '2025-01-10', departDate: '2025-01-18',
    color: 'from-cyan-400 to-blue-600', bgGradient: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-300', emoji: '\u{1F1E6}\u{1F1FA}',
    photos: ['Opera House', 'Bondi Beach', 'Harbour Bridge'],
    highlights: ['Surfing at Bondi', 'Blue Mountains day trip', 'Manly Ferry ride'],
    tripType: 'Adventure',
  },
  {
    id: '8', city: 'Marrakech', country: 'Morocco', continent: 'Africa',
    visitDate: '2024-11-22', departDate: '2024-11-29',
    color: 'from-amber-500 to-rose-600', bgGradient: 'bg-gradient-to-br from-amber-500 to-rose-600',
    borderColor: 'border-amber-400', emoji: '\u{1F1F2}\u{1F1E6}',
    photos: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Atlas Mountains'],
    highlights: ['Haggling in the souks', 'Traditional hammam', 'Sahara desert camel ride'],
    tripType: 'Cultural',
  },
  {
    id: '9', city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America',
    visitDate: '2024-09-01', departDate: '2024-09-08',
    color: 'from-green-400 to-yellow-500', bgGradient: 'bg-gradient-to-br from-green-400 to-yellow-500',
    borderColor: 'border-green-300', emoji: '\u{1F1E7}\u{1F1F7}',
    photos: ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain'],
    highlights: ['Samba at Lapa', 'Hang gliding over Tijuca', 'Acai on the beach'],
    tripType: 'Adventure',
  },
  {
    id: '10', city: 'Dubai', country: 'UAE', continent: 'Asia',
    visitDate: '2024-07-15', departDate: '2024-07-21',
    color: 'from-violet-400 to-purple-600', bgGradient: 'bg-gradient-to-br from-violet-400 to-purple-600',
    borderColor: 'border-violet-300', emoji: '\u{1F1E6}\u{1F1EA}',
    photos: ['Burj Khalifa', 'Dubai Mall', 'Desert Safari'],
    highlights: ['Desert dune bashing', 'Dhow cruise at Marina', 'Gold Souk exploration'],
    tripType: 'Luxury',
  },
  {
    id: '11', city: 'Reykjavik', country: 'Iceland', continent: 'Europe',
    visitDate: '2024-05-10', departDate: '2024-05-17',
    color: 'from-sky-300 to-blue-500', bgGradient: 'bg-gradient-to-br from-sky-300 to-blue-500',
    borderColor: 'border-sky-300', emoji: '\u{1F1EE}\u{1F1F8}',
    photos: ['Northern Lights', 'Blue Lagoon', 'Gullfoss waterfall'],
    highlights: ['Golden Circle tour', 'Whale watching', 'Snorkeling in Silfra'],
    tripType: 'Nature',
  },
  {
    id: '12', city: 'Bangkok', country: 'Thailand', continent: 'Asia',
    visitDate: '2024-03-01', departDate: '2024-03-07',
    color: 'from-pink-400 to-fuchsia-600', bgGradient: 'bg-gradient-to-br from-pink-400 to-fuchsia-600',
    borderColor: 'border-pink-300', emoji: '\u{1F1F9}\u{1F1ED}',
    photos: ['Grand Palace', 'Floating Market', 'Khao San Road'],
    highlights: ['Street food tour', 'Muay Thai fight night', 'Temple hopping by tuk-tuk'],
    tripType: 'Cultural',
  },
];

/* -------------------------------------------------------------------------- */
/*  Stamp design patterns (decorative SVG backgrounds per continent)          */
/* -------------------------------------------------------------------------- */

const stampPatterns: Record<Continent, string> = {
  Asia: 'M10 10 Q15 5 20 10 T30 10',
  Europe: 'M5 15 L15 5 L25 15 L15 25 Z',
  Africa: 'M15 5 L25 20 L5 20 Z',
  'North America': 'M5 10 H25 M15 5 V25',
  'South America': 'M15 5 Q25 15 15 25 Q5 15 15 5',
  Oceania: 'M10 15 Q15 5 20 15 Q15 25 10 15',
};

const continentColors: Record<Continent, string> = {
  Asia: 'bg-rose-100 text-rose-700',
  Europe: 'bg-blue-100 text-blue-700',
  Africa: 'bg-amber-100 text-amber-700',
  'North America': 'bg-orange-100 text-orange-700',
  'South America': 'bg-green-100 text-green-700',
  Oceania: 'bg-cyan-100 text-cyan-700',
};

const continentEmojis: Record<Continent, string> = {
  Asia: '\u{1F30F}',
  Europe: '\u{1F30D}',
  Africa: '\u{1F30D}',
  'North America': '\u{1F30E}',
  'South America': '\u{1F30E}',
  Oceania: '\u{1F30F}',
};

const tripTypeIcons: Record<string, string> = {
  Cultural: '\u{1F3DB}\u{FE0F}',
  Romantic: '\u{1F495}',
  Adventure: '\u{1F3D4}\u{FE0F}',
  Urban: '\u{1F3D9}\u{FE0F}',
  Wildlife: '\u{1F981}',
  Luxury: '\u{1F48E}',
  Nature: '\u{1F33F}',
};

/* -------------------------------------------------------------------------- */
/*  Helper functions                                                          */
/* -------------------------------------------------------------------------- */

function getDuration(start: string, end: string): number {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* -------------------------------------------------------------------------- */
/*  Continent filter options                                                  */
/* -------------------------------------------------------------------------- */

type FilterOption = 'All' | Continent;
const filterOptions: FilterOption[] = ['All', 'Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function PassportPage() {
  const [selectedStamp, setSelectedStamp] = useState<PassportStamp | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isShareToastVisible, setIsShareToastVisible] = useState(false);
  const passportRef = useRef<HTMLDivElement>(null);

  // Computed stats
  const uniqueCountries = [...new Set(mockStamps.map((s) => s.country))];
  const uniqueCities = [...new Set(mockStamps.map((s) => s.city))];
  const uniqueContinents = [...new Set(mockStamps.map((s) => s.continent))];
  const totalStamps = mockStamps.length;

  const currentTier = getCurrentTier(totalStamps);
  const nextTier = getNextTier(totalStamps);
  const TierIcon = currentTier.icon;

  const tierProgress = nextTier
    ? ((totalStamps - currentTier.minStamps) / (nextTier.minStamps - currentTier.minStamps)) * 100
    : 100;

  const worldTravelerTarget = 20;
  const countriesRemaining = Math.max(0, worldTravelerTarget - uniqueCountries.length);

  // Filtering
  const filteredStamps = activeFilter === 'All'
    ? mockStamps
    : mockStamps.filter((s) => s.continent === activeFilter);

  // Share handler
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Digital Passport - Partner',
          text: `I've collected ${totalStamps} stamps across ${uniqueCountries.length} countries and ${uniqueContinents.length} continents! Check out my travel passport on Partner.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `I've collected ${totalStamps} stamps across ${uniqueCountries.length} countries! Check out my travel passport on Partner: ${window.location.href}`
        );
        setIsShareToastVisible(true);
        setTimeout(() => setIsShareToastVisible(false), 3000);
      }
    } catch {
      // User cancelled share or clipboard failed
    }
  };

  return (
    <div className="space-y-6" ref={passportRef}>
      {/* Share Toast */}
      <AnimatePresence>
        {isShareToastVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#1A3C5E]">Digital Passport</h1>
          <p className="text-gray-500 text-sm">Your collection of travel stamps and memories</p>
        </div>
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="gap-2 border-[#1A3C5E]/20 text-[#1A3C5E] hover:bg-[#1A3C5E]/5"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </motion.div>

      {/* Passport Book Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-[#0d1b2a] border-0 overflow-hidden relative">
          {/* Decorative gold corners */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-400/30 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-400/30 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-amber-400/30 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-amber-400/30 rounded-br-xl" />

          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%">
              <pattern id="passport-bg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="30" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#passport-bg)" />
            </svg>
          </div>

          <CardContent className="p-6 sm:p-10 relative">
            {/* Passport Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="w-20 h-20 rounded-full border-2 border-amber-400 flex items-center justify-center mx-auto mb-4 bg-amber-400/10"
              >
                <Globe className="w-10 h-10 text-amber-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-amber-400 tracking-[0.2em] uppercase">
                Partner Passport
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto mt-3" />
              <p className="text-white/30 text-sm mt-2 tracking-wider">Travel Companion</p>
            </div>

            {/* Tier & Level display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <TierIcon className={cn('w-5 h-5', currentTier.color)} />
                <span className="text-lg font-bold text-white tracking-wide">{currentTier.name}</span>
              </div>
              <p className="text-white/30 text-xs mb-4">{currentTier.description}</p>
              {nextTier && (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
                    <span>{currentTier.name}</span>
                    <span>{nextTier.name}</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tierProgress}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
                      className="h-full bg-gradient-to-r from-amber-400 to-[#E8733A] rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-white/30 text-center mt-1.5">
                    {nextTier.minStamps - totalStamps} more stamps to unlock
                  </p>
                </div>
              )}
              {!nextTier && (
                <Badge className="bg-amber-400/20 text-amber-400 border-amber-400/30">
                  <Crown className="w-3 h-3 mr-1" /> Max Level Achieved
                </Badge>
              )}
            </motion.div>

            {/* Collected stamps mini-preview (passport book feel) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
              {mockStamps.slice(0, 8).map((stamp, i) => (
                <motion.div
                  key={stamp.id}
                  initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
                  transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 200 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedStamp(stamp)}
                >
                  <div
                    className={cn(
                      'relative rounded-lg p-3 bg-gradient-to-br text-white overflow-hidden border aspect-square flex flex-col items-center justify-center',
                      stamp.color, stamp.borderColor
                    )}
                  >
                    {/* Decorative stamp border */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1 left-1 right-1 bottom-1 border-2 border-dashed border-white rounded-md" />
                    </div>
                    {/* Stamp pattern SVG */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 30 30">
                      <path d={stampPatterns[stamp.continent]} fill="none" stroke="white" strokeWidth="1" />
                    </svg>
                    <span className="text-xl mb-1">{stamp.emoji}</span>
                    <p className="text-[10px] font-bold text-center leading-tight">{stamp.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-amber-400/10">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                Every stamp tells a story
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Countries', value: uniqueCountries.length, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Cities', value: uniqueCities.length, icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Total Stamps', value: totalStamps, icon: Stamp, color: 'text-[#E8733A]', bg: 'bg-orange-50' },
            { label: 'Continents', value: `${uniqueContinents.length}/6`, icon: Map, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A3C5E]">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Indicator - World Traveler Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-[#E8733A]/20 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E8733A] to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-200">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[#1A3C5E] text-sm">World Traveler Badge</h3>
                  <span className="text-xs font-semibold text-[#E8733A]">
                    {uniqueCountries.length}/{worldTravelerTarget}
                  </span>
                </div>
                <Progress value={(uniqueCountries.length / worldTravelerTarget) * 100} variant="accent" className="mb-1.5" />
                <p className="text-xs text-gray-500">
                  {countriesRemaining > 0
                    ? `${countriesRemaining} more ${countriesRemaining === 1 ? 'country' : 'countries'} to unlock World Traveler badge`
                    : 'World Traveler badge unlocked!'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tier Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1A3C5E]" />
              Passport Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {tiers.map((tier, i) => {
                const isActive = currentTier.name === tier.name;
                const isUnlocked = totalStamps >= tier.minStamps;
                return (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <div
                      className={cn(
                        'relative rounded-xl p-4 border-2 text-center transition-all',
                        isActive
                          ? 'border-[#E8733A] bg-orange-50/50 shadow-md'
                          : isUnlocked
                            ? 'border-green-200 bg-green-50/30'
                            : 'border-gray-100 bg-gray-50 opacity-60'
                      )}
                    >
                      {isActive && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <Badge className="bg-[#E8733A] text-white text-[9px] px-2 py-0">Current</Badge>
                        </div>
                      )}
                      <tier.icon className={cn('w-8 h-8 mx-auto mb-2', tier.color)} />
                      <p className="font-bold text-sm text-[#1A3C5E]">{tier.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{tier.minStamps}+ stamps</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stamp Collection Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg font-bold text-[#1A3C5E] flex items-center gap-2">
            <Stamp className="w-5 h-5 text-[#E8733A]" />
            Stamp Collection
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                  activeFilter === opt
                    ? 'bg-[#1A3C5E] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredStamps.map((stamp, i) => (
              <motion.div
                key={stamp.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full"
                  onClick={() => setSelectedStamp(stamp)}
                >
                  {/* Stamp artwork header */}
                  <div className={cn('h-36 relative overflow-hidden', stamp.bgGradient)}>
                    {/* Decorative SVG pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 120">
                      <path d={stampPatterns[stamp.continent]} fill="none" stroke="white" strokeWidth="2" transform="scale(4) translate(5,5)" />
                      <circle cx="160" cy="30" r="25" fill="none" stroke="white" strokeWidth="1" />
                      <circle cx="40" cy="90" r="15" fill="none" stroke="white" strokeWidth="1" />
                    </svg>

                    {/* Stamp border effect */}
                    <div className="absolute inset-2 border-2 border-dashed border-white/20 rounded-lg" />

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <motion.span
                        className="text-4xl mb-1"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: 'spring' }}
                      >
                        {stamp.emoji}
                      </motion.span>
                      <span className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-70">
                        {stamp.continent}
                      </span>
                    </div>

                    {/* Trip type badge */}
                    <div className="absolute top-2 right-2">
                      <span className="text-lg" title={stamp.tripType}>
                        {tripTypeIcons[stamp.tripType] || '\u{2708}\u{FE0F}'}
                      </span>
                    </div>

                    {/* Stamp icon watermark */}
                    <div className="absolute bottom-2 left-2 opacity-30">
                      <Stamp className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-[#1A3C5E] text-base">{stamp.city}</h3>
                      <Badge className={cn('text-[10px] font-medium', continentColors[stamp.continent])}>
                        {stamp.continent}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" />
                      {stamp.country}
                    </p>

                    <Separator className="mb-3" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatDate(stamp.visitDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{getDuration(stamp.visitDate, stamp.departDate)} days</span>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#E8733A] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View details <ChevronRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredStamps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No stamps in this region yet</p>
            <p className="text-gray-300 text-sm mt-1">Keep exploring to collect stamps from every continent!</p>
          </motion.div>
        )}
      </motion.div>

      {/* Continent Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E8733A]" />
              Continent Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'] as Continent[]).map((continent) => {
                const count = mockStamps.filter((s) => s.continent === continent).length;
                const isVisited = count > 0;
                return (
                  <div
                    key={continent}
                    className={cn(
                      'rounded-xl p-4 border transition-all text-center',
                      isVisited
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-gray-100 bg-gray-50 opacity-50'
                    )}
                  >
                    <div className="text-2xl mb-1">
                      {continentEmojis[continent]}
                    </div>
                    <p className="text-sm font-bold text-[#1A3C5E]">{continent}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isVisited ? `${count} ${count === 1 ? 'stamp' : 'stamps'}` : 'Not visited'}
                    </p>
                    {isVisited && (
                      <div className="mt-1">
                        <svg className="w-4 h-4 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <Card className="inline-block">
          <CardContent className="px-8 py-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-[#1A3C5E] text-lg">{totalStamps}</span>{' '}
              Stamps Collected
              <span className="mx-3 text-gray-300">|</span>
              <span className="font-bold text-[#E8733A] text-lg">{uniqueCountries.length}</span>{' '}
              Countries
              <span className="mx-3 text-gray-300">|</span>
              <span className="font-bold text-purple-600 text-lg">{uniqueContinents.length}</span>{' '}
              Continents
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stamp Detail Dialog */}
      <Dialog open={!!selectedStamp} onOpenChange={(open) => !open && setSelectedStamp(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedStamp && (
            <>
              {/* Stamp header visual */}
              <div className={cn('rounded-xl p-6 text-white text-center -mx-2 -mt-2 mb-4 relative', selectedStamp.bgGradient)}>
                {/* Dashed stamp border */}
                <div className="absolute inset-2 border-2 border-dashed border-white/15 rounded-lg pointer-events-none" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 200 120">
                  <path d={stampPatterns[selectedStamp.continent]} fill="none" stroke="white" strokeWidth="2" transform="scale(4) translate(5,5)" />
                </svg>
                <motion.div
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <span className="text-5xl block mb-2">{selectedStamp.emoji}</span>
                </motion.div>
                <h2 className="text-2xl font-bold relative">{selectedStamp.city}</h2>
                <p className="text-white/70 text-sm relative">{selectedStamp.country}</p>
              </div>

              <DialogHeader>
                <DialogTitle className="sr-only">{selectedStamp.city} Stamp Details</DialogTitle>
                <DialogDescription className="sr-only">
                  Details about your visit to {selectedStamp.city}, {selectedStamp.country}
                </DialogDescription>
              </DialogHeader>

              {/* Trip details */}
              <div className="space-y-4">
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Visited</p>
                    <p className="text-sm font-bold text-[#1A3C5E]">{formatDate(selectedStamp.visitDate)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Duration</p>
                    <p className="text-sm font-bold text-[#1A3C5E]">
                      {getDuration(selectedStamp.visitDate, selectedStamp.departDate)} days
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <Map className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Continent</p>
                    <p className="text-sm font-bold text-[#1A3C5E]">{selectedStamp.continent}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <Plane className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Trip Type</p>
                    <p className="text-sm font-bold text-[#1A3C5E]">
                      {tripTypeIcons[selectedStamp.tripType]} {selectedStamp.tripType}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Photos */}
                <div>
                  <h4 className="text-sm font-bold text-[#1A3C5E] mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#E8733A]" />
                    Photos
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedStamp.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'aspect-square rounded-lg flex items-center justify-center text-white text-[10px] font-medium text-center p-2',
                          selectedStamp.bgGradient, 'opacity-80'
                        )}
                      >
                        {photo}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Highlights */}
                <div>
                  <h4 className="text-sm font-bold text-[#1A3C5E] mb-2 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    Trip Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedStamp.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px]">{idx + 1}</span>
                        </div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Share this stamp */}
                <Button
                  onClick={handleShare}
                  className="w-full bg-[#1A3C5E] hover:bg-[#152d47] gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share This Stamp
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
