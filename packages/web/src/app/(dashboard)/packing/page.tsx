'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Luggage, Sparkles, ListChecks, CalendarDays, Clock, MapPin,
  Plus, Check, ChevronDown, ChevronUp, Trash2, Sun, Cloud,
  CloudRain, Snowflake, Wind, Thermometer, Shirt, Smartphone,
  FileText, Heart, Wallet, Tent, Camera, Plane, Hotel, Shield,
  Share2, Save, Copy, Users, User, UserPlus, Search,
  Mountain, Palmtree, Building2, Compass, Coffee, UtensilsCrossed,
  Eye, Bus, Footprints, BedDouble, Loader2, CheckCircle, Download,
  RefreshCw, X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

/* ──────────────── Types ──────────────── */

interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
  essential: boolean;
  quantity: number;
}

interface PackingCategory {
  id: string;
  name: string;
  emoji: string;
  icon: React.ElementType;
  color: string;
  items: PackingItem[];
}

interface WeatherDay {
  day: string;
  date: string;
  temp: number;
  tempMin: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  suggestion: string;
}

interface ItineraryActivity {
  id: string;
  time: string;
  activity: string;
  location: string;
  type: 'transport' | 'sightseeing' | 'meal' | 'rest' | 'adventure';
  duration: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  date: string;
  activities: ItineraryActivity[];
}

interface PreTripItem {
  id: string;
  label: string;
  checked: boolean;
  category: 'booking' | 'documents' | 'finance' | 'health' | 'misc';
  icon: React.ElementType;
}

interface PackingTemplate {
  id: string;
  name: string;
  destination: string;
  tripType: string;
  itemCount: number;
  createdAt: string;
}

/* ──────────────── Constants ──────────────── */

const tripTypes = [
  { key: 'beach', label: 'Beach', icon: Palmtree, emoji: '🏖️' },
  { key: 'mountain', label: 'Mountain', icon: Mountain, emoji: '🏔️' },
  { key: 'city', label: 'City', icon: Building2, emoji: '🏙️' },
  { key: 'desert', label: 'Desert', icon: Compass, emoji: '🏜️' },
  { key: 'cultural', label: 'Cultural', icon: Eye, emoji: '🏛️' },
];

const travelerTypes = [
  { key: 'solo', label: 'Solo', icon: User },
  { key: 'duo', label: 'Duo', icon: UserPlus },
  { key: 'group', label: 'Group', icon: Users },
];

const activityTypes: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  transport: { label: 'Transport', icon: Bus, color: 'bg-blue-100 text-blue-700' },
  sightseeing: { label: 'Sightseeing', icon: Camera, color: 'bg-purple-100 text-purple-700' },
  meal: { label: 'Meal', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-700' },
  rest: { label: 'Rest', icon: BedDouble, color: 'bg-green-100 text-green-700' },
  adventure: { label: 'Adventure', icon: Footprints, color: 'bg-red-100 text-red-700' },
};

const weatherIcons: Record<string, React.ElementType> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  windy: Wind,
};

const weatherColors: Record<string, string> = {
  sunny: 'text-amber-500',
  cloudy: 'text-gray-400',
  rainy: 'text-blue-500',
  snowy: 'text-cyan-400',
  windy: 'text-teal-500',
};

/* ──────────────── Packing List Templates by Trip Type ──────────────── */

function generatePackingList(tripType: string, duration: number, travelerType: string): PackingCategory[] {
  const multiplier = travelerType === 'duo' ? 2 : travelerType === 'group' ? 4 : 1;
  const days = Math.max(1, duration);
  let nextId = 1;
  const id = () => String(nextId++);

  const baseClothing: PackingItem[] = [
    { id: id(), name: `Underwear (${Math.min(days + 2, 10) * multiplier} pairs)`, packed: false, essential: true, quantity: Math.min(days + 2, 10) * multiplier },
    { id: id(), name: `Socks (${Math.min(days + 1, 8) * multiplier} pairs)`, packed: false, essential: true, quantity: Math.min(days + 1, 8) * multiplier },
    { id: id(), name: 'Sleepwear', packed: false, essential: false, quantity: multiplier },
  ];

  const typeClothing: Record<string, PackingItem[]> = {
    beach: [
      { id: id(), name: `T-shirts (${Math.min(days, 7) * multiplier})`, packed: false, essential: true, quantity: Math.min(days, 7) * multiplier },
      { id: id(), name: `Shorts (${Math.ceil(days / 2) * multiplier})`, packed: false, essential: true, quantity: Math.ceil(days / 2) * multiplier },
      { id: id(), name: 'Swimsuit / Swim trunks', packed: false, essential: true, quantity: multiplier * 2 },
      { id: id(), name: 'Flip-flops / Sandals', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Beach cover-up / Sarong', packed: false, essential: false, quantity: multiplier },
      { id: id(), name: 'Light linen shirt', packed: false, essential: false, quantity: multiplier },
      { id: id(), name: 'Sun hat / Wide brim hat', packed: false, essential: true, quantity: multiplier },
    ],
    mountain: [
      { id: id(), name: `Thermal base layers (${Math.ceil(days / 2)} sets)`, packed: false, essential: true, quantity: Math.ceil(days / 2) },
      { id: id(), name: 'Fleece jacket / Mid-layer', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Waterproof outer shell', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: `Hiking pants (${Math.ceil(days / 2)})`, packed: false, essential: true, quantity: Math.ceil(days / 2) },
      { id: id(), name: 'Warm hat & gloves', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: `Wool socks (${Math.min(days + 1, 7)} pairs)`, packed: false, essential: true, quantity: Math.min(days + 1, 7) },
      { id: id(), name: 'Trekking boots (broken in)', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Gaiters', packed: false, essential: false, quantity: multiplier },
    ],
    city: [
      { id: id(), name: `Casual shirts/tops (${Math.min(days, 6) * multiplier})`, packed: false, essential: true, quantity: Math.min(days, 6) * multiplier },
      { id: id(), name: `Jeans / Trousers (${Math.ceil(days / 3)})`, packed: false, essential: true, quantity: Math.ceil(days / 3) },
      { id: id(), name: 'Smart casual outfit', packed: false, essential: false, quantity: multiplier },
      { id: id(), name: 'Comfortable walking shoes', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Light jacket / Blazer', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Dress shoes / Smart flats', packed: false, essential: false, quantity: multiplier },
    ],
    desert: [
      { id: id(), name: `Light long-sleeve shirts (${Math.min(days, 5) * multiplier})`, packed: false, essential: true, quantity: Math.min(days, 5) * multiplier },
      { id: id(), name: `Loose pants (${Math.ceil(days / 2)})`, packed: false, essential: true, quantity: Math.ceil(days / 2) },
      { id: id(), name: 'Head scarf / Shemagh', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Closed-toe breathable shoes', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Warm fleece (cold desert nights)', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Sand-proof goggles', packed: false, essential: false, quantity: multiplier },
    ],
    cultural: [
      { id: id(), name: `Modest tops/shirts (${Math.min(days, 6) * multiplier})`, packed: false, essential: true, quantity: Math.min(days, 6) * multiplier },
      { id: id(), name: `Full-length pants/skirts (${Math.ceil(days / 2)})`, packed: false, essential: true, quantity: Math.ceil(days / 2) },
      { id: id(), name: 'Scarf / Shawl (for temples)', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Comfortable walking shoes', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Slip-on shoes (temple visits)', packed: false, essential: true, quantity: multiplier },
    ],
  };

  const electronics: PackingItem[] = [
    { id: id(), name: 'Phone + charger', packed: false, essential: true, quantity: multiplier },
    { id: id(), name: 'Power bank (20000mAh)', packed: false, essential: true, quantity: Math.ceil(multiplier / 2) },
    { id: id(), name: 'Camera + extra batteries', packed: false, essential: false, quantity: 1 },
    { id: id(), name: 'Universal travel adapter', packed: false, essential: true, quantity: Math.ceil(multiplier / 2) },
    { id: id(), name: 'Earbuds / Headphones', packed: false, essential: false, quantity: multiplier },
    { id: id(), name: 'E-reader / Tablet', packed: false, essential: false, quantity: 1 },
    ...(tripType === 'mountain' ? [
      { id: id(), name: 'Headlamp / Flashlight', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'GPS device / Compass', packed: false, essential: false, quantity: 1 },
    ] : []),
    ...(tripType === 'beach' ? [
      { id: id(), name: 'Waterproof phone pouch', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Bluetooth speaker (waterproof)', packed: false, essential: false, quantity: 1 },
    ] : []),
  ];

  const documents: PackingItem[] = [
    { id: id(), name: 'Passport (valid 6+ months)', packed: false, essential: true, quantity: multiplier },
    { id: id(), name: 'Visa / Travel permit', packed: false, essential: true, quantity: multiplier },
    { id: id(), name: 'Flight / Train tickets', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Hotel booking confirmations', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Travel insurance documents', packed: false, essential: true, quantity: multiplier },
    { id: id(), name: 'Emergency contact list (printed)', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Photocopies of all documents', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Driver license / International DL', packed: false, essential: false, quantity: multiplier },
  ];

  const health: PackingItem[] = [
    { id: id(), name: 'Personal medications', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'First aid kit', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Sunscreen SPF 50+', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Insect repellent', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Lip balm with SPF', packed: false, essential: false, quantity: multiplier },
    { id: id(), name: 'Hand sanitizer', packed: false, essential: true, quantity: multiplier },
    { id: id(), name: 'Face masks', packed: false, essential: false, quantity: multiplier * 5 },
    ...(tripType === 'mountain' ? [
      { id: id(), name: 'Altitude sickness pills (Diamox)', packed: false, essential: true, quantity: 1 },
      { id: id(), name: 'Oral rehydration salts', packed: false, essential: true, quantity: 5 },
    ] : []),
    ...(tripType === 'beach' ? [
      { id: id(), name: 'Aloe vera gel (after-sun)', packed: false, essential: true, quantity: 1 },
      { id: id(), name: 'Motion sickness pills', packed: false, essential: false, quantity: 1 },
    ] : []),
  ];

  const money: PackingItem[] = [
    { id: id(), name: 'Cash (local currency)', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Debit / Credit cards (2+)', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Emergency USD / EUR cash', packed: false, essential: true, quantity: 1 },
    { id: id(), name: 'Money belt / Hidden pouch', packed: false, essential: false, quantity: multiplier },
    { id: id(), name: 'Zip-lock bag for receipts', packed: false, essential: false, quantity: 1 },
  ];

  const misc: PackingItem[] = [
    { id: id(), name: 'Reusable water bottle', packed: false, essential: true, quantity: multiplier },
    { id: id(), name: 'Day pack / Small backpack', packed: false, essential: true, quantity: multiplier },
    { id: id(), name: 'Packing cubes', packed: false, essential: false, quantity: 1 },
    { id: id(), name: 'Laundry bag', packed: false, essential: false, quantity: 1 },
    { id: id(), name: 'Travel pillow', packed: false, essential: false, quantity: multiplier },
    { id: id(), name: 'Snacks / Energy bars', packed: false, essential: false, quantity: 1 },
    { id: id(), name: 'Sunglasses (UV protection)', packed: false, essential: true, quantity: multiplier },
    ...(tripType === 'mountain' ? [
      { id: id(), name: 'Trekking poles', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Dry bags for electronics', packed: false, essential: true, quantity: 2 },
      { id: id(), name: 'Thermal flask', packed: false, essential: false, quantity: 1 },
    ] : []),
    ...(tripType === 'beach' ? [
      { id: id(), name: 'Beach towel (quick-dry)', packed: false, essential: true, quantity: multiplier },
      { id: id(), name: 'Snorkeling gear', packed: false, essential: false, quantity: multiplier },
      { id: id(), name: 'Cooler bag', packed: false, essential: false, quantity: 1 },
    ] : []),
    ...(tripType === 'desert' ? [
      { id: id(), name: 'Extra water containers', packed: false, essential: true, quantity: 2 },
    ] : []),
  ];

  return [
    { id: 'clothing', name: 'Clothing', emoji: '👕', icon: Shirt, color: 'bg-indigo-50 border-indigo-200', items: [...baseClothing, ...(typeClothing[tripType] || typeClothing.city)] },
    { id: 'electronics', name: 'Electronics', emoji: '🔌', icon: Smartphone, color: 'bg-cyan-50 border-cyan-200', items: electronics },
    { id: 'documents', name: 'Documents', emoji: '📄', icon: FileText, color: 'bg-amber-50 border-amber-200', items: documents },
    { id: 'health', name: 'Health & Hygiene', emoji: '💊', icon: Heart, color: 'bg-rose-50 border-rose-200', items: health },
    { id: 'money', name: 'Money & Finance', emoji: '💰', icon: Wallet, color: 'bg-emerald-50 border-emerald-200', items: money },
    { id: 'misc', name: 'Miscellaneous', emoji: '🎒', icon: Tent, color: 'bg-violet-50 border-violet-200', items: misc },
  ];
}

/* ──────────────── Mock Weather Data ──────────────── */

function generateWeather(destination: string, duration: number): WeatherDay[] {
  const conditions: Array<WeatherDay['condition']> = ['sunny', 'cloudy', 'rainy', 'sunny', 'windy'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const suggestions: Record<string, string> = {
    sunny: 'Pack sunscreen and stay hydrated. Great day for outdoor activities!',
    cloudy: 'Comfortable weather for sightseeing. Bring a light layer just in case.',
    rainy: 'Pack a waterproof jacket and umbrella. Plan indoor activities.',
    snowy: 'Layer up! Thermal wear and waterproof boots are essential.',
    windy: 'Secure loose items. A windbreaker is recommended.',
  };

  const destLower = destination.toLowerCase();
  const isCoastal = ['goa', 'bali', 'maldives', 'hawaii', 'cancun', 'phuket'].some(d => destLower.includes(d));
  const isCold = ['ladakh', 'switzerland', 'iceland', 'alaska', 'norway', 'manali', 'shimla'].some(d => destLower.includes(d));
  const isDesert = ['rajasthan', 'dubai', 'sahara', 'jaisalmer', 'atacama'].some(d => destLower.includes(d));

  return Array.from({ length: Math.min(duration, 7) }, (_, i) => {
    const baseTemp = isCoastal ? 30 : isCold ? 5 : isDesert ? 38 : 25;
    const variance = Math.floor(Math.random() * 8) - 4;
    const cond = isCold && Math.random() > 0.5 ? 'snowy' : conditions[(i + Math.floor(Math.random() * 3)) % conditions.length];
    return {
      day: dayNames[i % 7],
      date: `Mar ${13 + i}`,
      temp: baseTemp + variance,
      tempMin: baseTemp + variance - 6,
      condition: cond,
      humidity: 40 + Math.floor(Math.random() * 40),
      suggestion: suggestions[cond],
    };
  });
}

/* ──────────────── Mock Itinerary Data ──────────────── */

function generateItinerary(destination: string, duration: number, tripType: string): ItineraryDay[] {
  const destLower = destination.toLowerCase();
  const resolvedDest = destination || 'Your Destination';

  const templates: Record<string, ItineraryDay[]> = {
    ladakh: [
      { day: 1, title: 'Arrival & Acclimatization', date: 'Mar 13', activities: [
        { id: 'a1', time: '10:00 AM', activity: 'Arrive at Leh Kushok Bakula Airport', location: 'Leh Airport', type: 'transport', duration: '1h' },
        { id: 'a2', time: '12:00 PM', activity: 'Check-in & rest for altitude acclimatization', location: 'Grand Dragon Ladakh', type: 'rest', duration: '3h' },
        { id: 'a3', time: '4:00 PM', activity: 'Short walk around Leh Market', location: 'Main Bazaar, Leh', type: 'sightseeing', duration: '2h' },
        { id: 'a4', time: '7:00 PM', activity: 'Traditional Ladakhi dinner', location: 'Tibetan Kitchen', type: 'meal', duration: '1.5h' },
      ]},
      { day: 2, title: 'Leh Heritage & Monastery Tour', date: 'Mar 14', activities: [
        { id: 'b1', time: '8:00 AM', activity: 'Breakfast at hotel', location: 'Grand Dragon Ladakh', type: 'meal', duration: '1h' },
        { id: 'b2', time: '9:30 AM', activity: 'Visit Leh Palace & panoramic views', location: 'Leh Palace', type: 'sightseeing', duration: '1.5h' },
        { id: 'b3', time: '11:00 AM', activity: 'Shanti Stupa sunrise viewpoint', location: 'Shanti Stupa', type: 'sightseeing', duration: '1.5h' },
        { id: 'b4', time: '1:00 PM', activity: 'Lunch at Bon Appetit', location: 'Fort Road, Leh', type: 'meal', duration: '1h' },
        { id: 'b5', time: '3:00 PM', activity: 'Hall of Fame Museum', location: 'Leh-Karu Road', type: 'sightseeing', duration: '2h' },
      ]},
      { day: 3, title: 'Nubra Valley via Khardung La', date: 'Mar 15', activities: [
        { id: 'c1', time: '6:00 AM', activity: 'Early breakfast & pack for overnight', location: 'Hotel', type: 'meal', duration: '1h' },
        { id: 'c2', time: '7:00 AM', activity: 'Drive to Khardung La (18,380 ft)', location: 'Leh to Khardung La', type: 'transport', duration: '3h' },
        { id: 'c3', time: '10:00 AM', activity: 'Photo stop at world\'s highest motorable road', location: 'Khardung La Pass', type: 'sightseeing', duration: '30m' },
        { id: 'c4', time: '1:00 PM', activity: 'Arrive Hunder village, lunch', location: 'Hunder Village', type: 'meal', duration: '1h' },
        { id: 'c5', time: '3:00 PM', activity: 'Double-humped camel safari on sand dunes', location: 'Hunder Sand Dunes', type: 'adventure', duration: '2h' },
      ]},
      { day: 4, title: 'Pangong Lake Expedition', date: 'Mar 16', activities: [
        { id: 'd1', time: '7:00 AM', activity: 'Drive from Nubra via Shyok route', location: 'Nubra to Pangong', type: 'transport', duration: '5h' },
        { id: 'd2', time: '1:00 PM', activity: 'Arrive at Pangong Tso', location: 'Pangong Lake', type: 'sightseeing', duration: '1h' },
        { id: 'd3', time: '2:00 PM', activity: 'Lakeside picnic lunch', location: 'Pangong Lakefront', type: 'meal', duration: '1h' },
        { id: 'd4', time: '4:00 PM', activity: 'Photography & lake shore exploration', location: 'Pangong Lake', type: 'adventure', duration: '2h' },
        { id: 'd5', time: '7:00 PM', activity: 'Stargazing at the lake', location: 'Pangong Campsite', type: 'sightseeing', duration: '1h' },
      ]},
      { day: 5, title: 'Return & Departure', date: 'Mar 17', activities: [
        { id: 'e1', time: '6:00 AM', activity: 'Sunrise over Pangong Lake', location: 'Pangong Lake', type: 'sightseeing', duration: '1h' },
        { id: 'e2', time: '8:00 AM', activity: 'Drive back to Leh via Chang La', location: 'Pangong to Leh', type: 'transport', duration: '5h' },
        { id: 'e3', time: '2:00 PM', activity: 'Last-minute souvenir shopping', location: 'Leh Market', type: 'sightseeing', duration: '2h' },
        { id: 'e4', time: '5:00 PM', activity: 'Departure from Leh Airport', location: 'Leh Airport', type: 'transport', duration: '1h' },
      ]},
    ],
  };

  if (destLower.includes('ladakh')) return templates.ladakh.slice(0, duration);

  // Generate generic itinerary for any destination
  return Array.from({ length: Math.min(duration, 7) }, (_, i) => {
    const dayNum = i + 1;
    const isFirst = dayNum === 1;
    const isLast = dayNum === duration;
    const actBase: ItineraryActivity[] = [];
    let actId = 1;

    if (isFirst) {
      actBase.push(
        { id: `d${dayNum}a${actId++}`, time: '10:00 AM', activity: `Arrive at ${resolvedDest}`, location: `${resolvedDest} Airport/Station`, type: 'transport', duration: '1h' },
        { id: `d${dayNum}a${actId++}`, time: '12:00 PM', activity: 'Check-in & freshen up', location: 'Hotel', type: 'rest', duration: '2h' },
        { id: `d${dayNum}a${actId++}`, time: '3:00 PM', activity: 'Explore local neighborhood', location: `${resolvedDest} Downtown`, type: 'sightseeing', duration: '2h' },
        { id: `d${dayNum}a${actId++}`, time: '7:00 PM', activity: 'Welcome dinner - local cuisine', location: 'Local Restaurant', type: 'meal', duration: '1.5h' },
      );
    } else if (isLast) {
      actBase.push(
        { id: `d${dayNum}a${actId++}`, time: '8:00 AM', activity: 'Breakfast & checkout', location: 'Hotel', type: 'meal', duration: '1.5h' },
        { id: `d${dayNum}a${actId++}`, time: '10:00 AM', activity: 'Last-minute shopping', location: `${resolvedDest} Market`, type: 'sightseeing', duration: '2h' },
        { id: `d${dayNum}a${actId++}`, time: '1:00 PM', activity: 'Farewell lunch', location: 'Local Favorite', type: 'meal', duration: '1h' },
        { id: `d${dayNum}a${actId++}`, time: '4:00 PM', activity: 'Departure', location: `${resolvedDest} Airport/Station`, type: 'transport', duration: '1h' },
      );
    } else {
      const typeActivities: Record<string, string[]> = {
        beach: ['Snorkeling at coral reef', 'Beach volleyball', 'Sunset boat cruise', 'Water sports session', 'Island hopping'],
        mountain: ['Mountain trek', 'Visit alpine meadow', 'River rafting', 'Monastery visit', 'Nature photography'],
        city: ['Museum tour', 'Historic district walk', 'Street food tour', 'Shopping district visit', 'Art gallery hop'],
        desert: ['Desert safari', 'Camel ride', 'Sand dune photography', 'Oasis visit', 'Stargazing session'],
        cultural: ['Temple/shrine visit', 'Cultural workshop', 'Traditional art class', 'Heritage walk', 'Local cooking class'],
      };
      const acts = typeActivities[tripType] || typeActivities.city;
      actBase.push(
        { id: `d${dayNum}a${actId++}`, time: '8:00 AM', activity: 'Breakfast', location: 'Hotel', type: 'meal', duration: '1h' },
        { id: `d${dayNum}a${actId++}`, time: '9:30 AM', activity: acts[(dayNum + 0) % acts.length], location: `${resolvedDest} Area`, type: tripType === 'mountain' || tripType === 'desert' ? 'adventure' : 'sightseeing', duration: '2.5h' },
        { id: `d${dayNum}a${actId++}`, time: '12:30 PM', activity: 'Lunch at local spot', location: 'Local Restaurant', type: 'meal', duration: '1h' },
        { id: `d${dayNum}a${actId++}`, time: '2:00 PM', activity: acts[(dayNum + 1) % acts.length], location: `${resolvedDest} Point of Interest`, type: 'sightseeing', duration: '2h' },
        { id: `d${dayNum}a${actId++}`, time: '5:00 PM', activity: 'Free time / Relaxation', location: 'Hotel / Nearby Area', type: 'rest', duration: '1.5h' },
        { id: `d${dayNum}a${actId++}`, time: '7:30 PM', activity: 'Dinner', location: 'Recommended Eatery', type: 'meal', duration: '1.5h' },
      );
    }

    const titles: string[] = [
      'Arrival Day', 'Local Exploration', 'Adventure Day', 'Cultural Immersion',
      'Nature & Discovery', 'Leisure Day', 'Final Exploration', 'Departure Day'
    ];

    return {
      day: dayNum,
      title: isFirst ? 'Arrival & Settling In' : isLast ? 'Farewell & Departure' : titles[Math.min(dayNum, titles.length - 1)],
      date: `Mar ${12 + dayNum}`,
      activities: actBase,
    };
  });
}

/* ──────────────── Pre-Trip Checklist ──────────────── */

const defaultPreTripChecklist: PreTripItem[] = [
  { id: 'pt1', label: 'Flight / Train booked & confirmed', checked: false, category: 'booking', icon: Plane },
  { id: 'pt2', label: 'Accommodation reserved', checked: false, category: 'booking', icon: Hotel },
  { id: 'pt3', label: 'Airport transfer arranged', checked: false, category: 'booking', icon: Bus },
  { id: 'pt4', label: 'Travel insurance purchased', checked: false, category: 'documents', icon: Shield },
  { id: 'pt5', label: 'Passport valid (6+ months)', checked: false, category: 'documents', icon: FileText },
  { id: 'pt6', label: 'Visa arranged (if needed)', checked: false, category: 'documents', icon: FileText },
  { id: 'pt7', label: 'Document copies (digital + physical)', checked: false, category: 'documents', icon: Copy },
  { id: 'pt8', label: 'Currency exchanged', checked: false, category: 'finance', icon: Wallet },
  { id: 'pt9', label: 'Bank notified of travel dates', checked: false, category: 'finance', icon: Wallet },
  { id: 'pt10', label: 'Vaccinations up to date', checked: false, category: 'health', icon: Heart },
  { id: 'pt11', label: 'Prescriptions filled', checked: false, category: 'health', icon: Heart },
  { id: 'pt12', label: 'Emergency contacts registered', checked: false, category: 'misc', icon: Users },
  { id: 'pt13', label: 'Home security arranged', checked: false, category: 'misc', icon: Shield },
  { id: 'pt14', label: 'Phone data plan / SIM sorted', checked: false, category: 'misc', icon: Smartphone },
  { id: 'pt15', label: 'Packing completed', checked: false, category: 'misc', icon: Luggage },
];

/* ──────────────── Saved Templates ──────────────── */

const mockTemplates: PackingTemplate[] = [
  { id: 't1', name: 'Ladakh Adventure Pack', destination: 'Ladakh', tripType: 'Mountain', itemCount: 42, createdAt: '2026-02-20' },
  { id: 't2', name: 'Goa Beach Getaway', destination: 'Goa', tripType: 'Beach', itemCount: 35, createdAt: '2026-01-15' },
  { id: 't3', name: 'Tokyo City Explorer', destination: 'Tokyo', tripType: 'City', itemCount: 30, createdAt: '2025-12-10' },
];

/* ──────────────── Fade Animation ──────────────── */

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ──────────────── Page Component ──────────────── */

export default function PackingPage() {
  // Trip configuration
  const [destination, setDestination] = useState('Ladakh');
  const [duration, setDuration] = useState('5');
  const [tripType, setTripType] = useState('mountain');
  const [travelerType, setTravelerType] = useState('solo');

  // Packing list state
  const [packingList, setPackingList] = useState<PackingCategory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['clothing']));
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({});
  const [showAddItem, setShowAddItem] = useState<Record<string, boolean>>({});

  // Weather
  const [weather, setWeather] = useState<WeatherDay[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [addingActivity, setAddingActivity] = useState<number | null>(null);
  const [newActivity, setNewActivity] = useState({ time: '', activity: '', location: '', type: 'sightseeing' as ItineraryActivity['type'] });

  // Pre-trip checklist
  const [preTripList, setPreTripList] = useState<PreTripItem[]>(defaultPreTripChecklist);

  // Templates
  const [templates, setTemplates] = useState<PackingTemplate[]>(mockTemplates);
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('packing');

  // Generate packing list
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    // Simulate API call
    try {
      // Try real API first
      await api.post('/packing/generate', {
        destination,
        duration: parseInt(duration),
        tripType,
        travelerType,
      }).then((res) => {
        if (res.data?.data?.categories) {
          setPackingList(res.data.data.categories);
        } else {
          throw new Error('No data');
        }
      }).catch(() => {
        // Fallback to local generation
        const list = generatePackingList(tripType, parseInt(duration), travelerType);
        setPackingList(list);
      });

      const weatherData = generateWeather(destination, parseInt(duration));
      setWeather(weatherData);

      const itin = generateItinerary(destination, parseInt(duration), tripType);
      setItinerary(itin);
      setExpandedDay(1);
    } finally {
      // Brief delay for UX polish
      await new Promise((r) => setTimeout(r, 800));
      setIsGenerating(false);
      setIsGenerated(true);
      setExpandedCategories(new Set(['clothing']));
    }
  }, [destination, duration, tripType, travelerType]);

  // Auto-generate on mount
  useEffect(() => {
    handleGenerate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle packing item
  const togglePackItem = useCallback((categoryId: string, itemId: string) => {
    setPackingList((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.map((item) => (item.id === itemId ? { ...item, packed: !item.packed } : item)) }
          : cat
      )
    );
  }, []);

  // Remove item
  const removePackItem = useCallback((categoryId: string, itemId: string) => {
    setPackingList((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      )
    );
  }, []);

  // Add custom item
  const addCustomItem = useCallback((categoryId: string) => {
    const name = newItemInputs[categoryId]?.trim();
    if (!name) return;
    setPackingList((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, { id: `custom-${Date.now()}`, name, packed: false, essential: false, quantity: 1 }] }
          : cat
      )
    );
    setNewItemInputs((prev) => ({ ...prev, [categoryId]: '' }));
    setShowAddItem((prev) => ({ ...prev, [categoryId]: false }));
  }, [newItemInputs]);

  // Toggle category expand
  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  // Toggle pre-trip item
  const togglePreTripItem = useCallback((id: string) => {
    setPreTripList((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  }, []);

  // Add itinerary activity
  const addItineraryActivity = useCallback((dayNum: number) => {
    if (!newActivity.time || !newActivity.activity) return;
    setItinerary((prev) =>
      prev.map((day) =>
        day.day === dayNum
          ? {
              ...day,
              activities: [...day.activities, {
                id: `new-${Date.now()}`,
                ...newActivity,
                duration: '1h',
              }].sort((a, b) => a.time.localeCompare(b.time)),
            }
          : day
      )
    );
    setNewActivity({ time: '', activity: '', location: '', type: 'sightseeing' });
    setAddingActivity(null);
  }, [newActivity]);

  // Remove itinerary activity
  const removeActivity = useCallback((dayNum: number, actId: string) => {
    setItinerary((prev) =>
      prev.map((day) =>
        day.day === dayNum
          ? { ...day, activities: day.activities.filter((a) => a.id !== actId) }
          : day
      )
    );
  }, []);

  // Save template
  const handleSaveTemplate = useCallback(() => {
    if (!templateName.trim()) return;
    const totalItems = packingList.reduce((acc, cat) => acc + cat.items.length, 0);
    const newTemplate: PackingTemplate = {
      id: `t-${Date.now()}`,
      name: templateName,
      destination,
      tripType,
      itemCount: totalItems,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    setTemplateName('');
    setShowSaveTemplate(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, [templateName, destination, tripType, packingList]);

  // Share
  const handleShare = useCallback(() => {
    // Simulate share
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  }, []);

  // Computed values
  const totalItems = packingList.reduce((acc, cat) => acc + cat.items.length, 0);
  const packedItems = packingList.reduce((acc, cat) => acc + cat.items.filter((i) => i.packed).length, 0);
  const packProgress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const preTripDone = preTripList.filter((c) => c.checked).length;
  const preTripProgress = Math.round((preTripDone / preTripList.length) * 100);

  const essentialsPacked = packingList.reduce((acc, cat) => acc + cat.items.filter((i) => i.essential && i.packed).length, 0);
  const essentialsTotal = packingList.reduce((acc, cat) => acc + cat.items.filter((i) => i.essential).length, 0);

  // Filter items by search
  const filteredPackingList = useMemo(() => {
    if (!searchQuery.trim()) return packingList;
    const q = searchQuery.toLowerCase();
    return packingList.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.name.toLowerCase().includes(q)),
    })).filter((cat) => cat.items.length > 0);
  }, [packingList, searchQuery]);

  const preTripCategories = useMemo(() => {
    const cats: Record<string, PreTripItem[]> = {};
    preTripList.forEach((item) => {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    });
    return cats;
  }, [preTripList]);

  const catLabels: Record<string, string> = {
    booking: 'Bookings & Reservations',
    documents: 'Documents & Insurance',
    finance: 'Finance & Banking',
    health: 'Health & Medical',
    misc: 'Other Essentials',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
              <Luggage className="w-7 h-7 text-[#E8733A]" />
              Smart Packing & Trip Planner
            </h1>
            <p className="text-gray-500 text-sm mt-1">AI-powered packing lists, weather insights, and day-by-day planning</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn('gap-1.5 transition-all', shareSuccess ? 'border-green-300 text-green-600' : 'text-[#1A3C5E] border-[#1A3C5E]/30')}
              onClick={handleShare}
            >
              {shareSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {shareSuccess ? 'Link Copied!' : 'Share'}
            </Button>
            <Button
              size="sm"
              className={cn('gap-1.5 transition-all', saveSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-[#E8733A] hover:bg-[#d4642e]')}
              onClick={() => {
                if (saveSuccess) return;
                setShowSaveTemplate(true);
              }}
            >
              {saveSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saveSuccess ? 'Saved!' : 'Save Template'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Save Template Dialog */}
      <AnimatePresence>
        {showSaveTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-2 border-[#E8733A]/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Template name (e.g., Ladakh Winter Trek)"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTemplate()}
                  />
                  <Button size="sm" className="bg-[#E8733A] hover:bg-[#d4642e]" onClick={handleSaveTemplate}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowSaveTemplate(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip Configuration */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <Card className="border-2 border-[#1A3C5E]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-[#1A3C5E]">
              <Sparkles className="w-5 h-5 text-[#E8733A]" />
              Trip Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Duration (days)</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="90"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Travel Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {tripTypes.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTripType(t.key)}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                        tripType === t.key
                          ? 'bg-[#E8733A] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      <span className="text-sm">{t.emoji}</span>
                      <span className="hidden sm:inline">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Traveler Type</label>
                <div className="flex gap-1.5">
                  {travelerTypes.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setTravelerType(t.key)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 justify-center',
                          travelerType === t.key
                            ? 'bg-[#1A3C5E] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button
              className="bg-[#E8733A] hover:bg-[#d4642e] gap-2 w-full sm:w-auto"
              onClick={handleGenerate}
              disabled={isGenerating || !destination.trim()}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Smart Pack'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Luggage className="w-12 h-12 text-[#E8733A]" />
            </motion.div>
            <p className="mt-4 text-[#1A3C5E] font-medium">Generating your smart packing list...</p>
            <p className="text-sm text-gray-400 mt-1">Analyzing destination, weather, and travel type</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Tabs */}
      {isGenerated && !isGenerating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Card className="bg-gradient-to-br from-[#E8733A]/5 to-[#E8733A]/10 border-[#E8733A]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8733A]/15 flex items-center justify-center">
                    <Luggage className="w-5 h-5 text-[#E8733A]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A3C5E]">{packedItems}/{totalItems}</p>
                    <p className="text-xs text-gray-500">Items Packed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A3C5E]">{packProgress}%</p>
                    <p className="text-xs text-gray-500">Pack Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-rose-100/50 border-red-200/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A3C5E]">{essentialsPacked}/{essentialsTotal}</p>
                    <p className="text-xs text-gray-500">Essentials Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100/50 border-blue-200/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <ListChecks className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1A3C5E]">{preTripDone}/{preTripList.length}</p>
                    <p className="text-xs text-gray-500">Pre-Trip Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#1A3C5E]">Overall Packing Progress</span>
              <span className="text-sm font-bold text-[#E8733A]">{packProgress}%</span>
            </div>
            <Progress value={packProgress} variant="accent" className="h-3" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 gap-1 h-auto p-1">
              <TabsTrigger value="packing" className="gap-1.5 text-xs sm:text-sm py-2">
                <Luggage className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Packing</span> List
              </TabsTrigger>
              <TabsTrigger value="weather" className="gap-1.5 text-xs sm:text-sm py-2">
                <Sun className="w-3.5 h-3.5" />
                Weather
              </TabsTrigger>
              <TabsTrigger value="itinerary" className="gap-1.5 text-xs sm:text-sm py-2">
                <CalendarDays className="w-3.5 h-3.5" />
                Itinerary
              </TabsTrigger>
              <TabsTrigger value="pretrip" className="gap-1.5 text-xs sm:text-sm py-2">
                <ListChecks className="w-3.5 h-3.5" />
                Pre-Trip
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-1.5 text-xs sm:text-sm py-2">
                <Copy className="w-3.5 h-3.5" />
                Templates
              </TabsTrigger>
            </TabsList>

            {/* ═══════════ PACKING LIST TAB ═══════════ */}
            <TabsContent value="packing" className="mt-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Category Cards */}
              <div className="space-y-3">
                {filteredPackingList.map((cat, catIdx) => {
                  const CatIcon = cat.icon;
                  const catPacked = cat.items.filter((i) => i.packed).length;
                  const catTotal = cat.items.length;
                  const catProgress = catTotal > 0 ? Math.round((catPacked / catTotal) * 100) : 0;
                  const isExpanded = expandedCategories.has(cat.id);

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIdx * 0.05 }}
                    >
                      <Card className={cn('overflow-hidden transition-all', isExpanded && 'ring-1 ring-[#E8733A]/20')}>
                        {/* Category Header */}
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => toggleCategory(cat.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', cat.color)}>
                              <span className="text-lg">{cat.emoji}</span>
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#1A3C5E] text-sm">{cat.name}</span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-[10px]',
                                    catProgress === 100 ? 'bg-green-50 text-green-600 border-green-200' : ''
                                  )}
                                >
                                  {catPacked}/{catTotal}
                                </Badge>
                                {catProgress === 100 && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  </motion.div>
                                )}
                              </div>
                              <div className="w-24 h-1.5 rounded-full bg-gray-200 mt-1">
                                <div
                                  className="h-full rounded-full bg-[#E8733A] transition-all duration-500"
                                  style={{ width: `${catProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4 text-gray-400" />
                            : <ChevronDown className="w-4 h-4 text-gray-400" />
                          }
                        </button>

                        {/* Items */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <Separator />
                              <div className="px-4 py-3 space-y-1">
                                {cat.items.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    layout
                                    className="flex items-center gap-3 py-1.5 group"
                                  >
                                    <motion.button
                                      className={cn(
                                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0',
                                        item.packed
                                          ? 'bg-[#E8733A] border-[#E8733A]'
                                          : 'border-gray-300 hover:border-[#E8733A]'
                                      )}
                                      onClick={() => togglePackItem(cat.id, item.id)}
                                      whileTap={{ scale: 1.3 }}
                                    >
                                      <AnimatePresence>
                                        {item.packed && (
                                          <motion.div
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 45 }}
                                          >
                                            <Check className="w-3 h-3 text-white" />
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.button>
                                    <span className={cn(
                                      'text-sm flex-1 transition-all',
                                      item.packed && 'line-through text-gray-400'
                                    )}>
                                      {item.name}
                                    </span>
                                    {item.essential && (
                                      <Badge className="bg-red-50 text-red-600 border-red-200 text-[10px] py-0">
                                        Essential
                                      </Badge>
                                    )}
                                    <button
                                      onClick={() => removePackItem(cat.id, item.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                                    </button>
                                  </motion.div>
                                ))}

                                {/* Add Custom Item */}
                                {showAddItem[cat.id] ? (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex items-center gap-2 pt-2"
                                  >
                                    <Input
                                      placeholder="Add custom item..."
                                      value={newItemInputs[cat.id] || ''}
                                      onChange={(e) => setNewItemInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                                      className="text-sm h-8"
                                      autoFocus
                                      onKeyDown={(e) => e.key === 'Enter' && addCustomItem(cat.id)}
                                    />
                                    <Button size="sm" className="h-8 bg-[#E8733A] hover:bg-[#d4642e]" onClick={() => addCustomItem(cat.id)}>
                                      Add
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8" onClick={() => setShowAddItem((prev) => ({ ...prev, [cat.id]: false }))}>
                                      <X className="w-3.5 h-3.5" />
                                    </Button>
                                  </motion.div>
                                ) : (
                                  <button
                                    onClick={() => setShowAddItem((prev) => ({ ...prev, [cat.id]: true }))}
                                    className="flex items-center gap-1.5 text-xs text-[#E8733A] hover:text-[#d4642e] pt-2 font-medium"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add custom item
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ═══════════ WEATHER TAB ═══════════ */}
            <TabsContent value="weather" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#1A3C5E]">
                    <Thermometer className="w-5 h-5 text-[#E8733A]" />
                    Weather Forecast - {destination}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weather.length === 0 ? (
                    <div className="text-center py-8">
                      <Cloud className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Generate a packing list to see weather data</p>
                    </div>
                  ) : (
                    <>
                      {/* Weather Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
                        {weather.map((day, i) => {
                          const WIcon = weatherIcons[day.condition];
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200 p-3 text-center hover:shadow-md transition-shadow"
                            >
                              <p className="text-xs font-medium text-gray-500">{day.day}</p>
                              <p className="text-[10px] text-gray-400">{day.date}</p>
                              <motion.div
                                className="my-2"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                              >
                                <WIcon className={cn('w-8 h-8 mx-auto', weatherColors[day.condition])} />
                              </motion.div>
                              <p className="text-lg font-bold text-[#1A3C5E]">{day.temp}°C</p>
                              <p className="text-[10px] text-gray-400">Low {day.tempMin}°C</p>
                              <p className="text-[10px] text-blue-400 mt-1">{day.humidity}% humidity</p>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Weather Suggestions */}
                      <h3 className="font-semibold text-[#1A3C5E] mb-3 flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-[#E8733A]" />
                        Weather-Based Packing Suggestions
                      </h3>
                      <div className="space-y-2">
                        {weather.map((day, i) => {
                          const WIcon = weatherIcons[day.condition];
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                            >
                              <WIcon className={cn('w-5 h-5 mt-0.5 shrink-0', weatherColors[day.condition])} />
                              <div>
                                <p className="text-sm font-medium text-[#1A3C5E]">
                                  {day.day}, {day.date} - {day.temp}°C ({day.condition})
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{day.suggestion}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ═══════════ ITINERARY TAB ═══════════ */}
            <TabsContent value="itinerary" className="mt-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-[#1A3C5E] flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#E8733A]" />
                  Day-by-Day Itinerary
                </h2>
                <Badge className="bg-[#1A3C5E] text-white text-xs px-3 py-1">
                  {destination} - {duration} Day{parseInt(duration) > 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Activity Type Legend */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-medium text-gray-500 mr-1">Activity Types:</span>
                {Object.entries(activityTypes).map(([key, val]) => {
                  const AIcon = val.icon;
                  return (
                    <span key={key} className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', val.color)}>
                      <AIcon className="w-3 h-3" />
                      {val.label}
                    </span>
                  );
                })}
              </div>

              <div className="space-y-3">
                {itinerary.map((day) => (
                  <Card key={day.day} className="overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8733A] to-[#d4642e] text-white flex items-center justify-center text-sm font-bold shadow-md">
                          {day.day}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-[#1A3C5E] text-sm">Day {day.day} - {day.title}</p>
                          <p className="text-xs text-gray-500">{day.date} &middot; {day.activities.length} activities</p>
                        </div>
                      </div>
                      {expandedDay === day.day
                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </button>

                    <AnimatePresence>
                      {expandedDay === day.day && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <Separator />
                          <div className="px-4 pb-4 pt-2">
                            <div className="border-l-2 border-[#E8733A]/30 ml-5 pl-5 space-y-4">
                              {day.activities.map((act, actIdx) => {
                                const aType = activityTypes[act.type];
                                const AIcon = aType?.icon || Camera;
                                return (
                                  <motion.div
                                    key={act.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: actIdx * 0.05 }}
                                    className="relative group"
                                  >
                                    <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-[#E8733A] border-2 border-white shadow" />
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className="text-xs font-bold text-[#E8733A]">{act.time}</span>
                                          <span className={cn('flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium', aType?.color || 'bg-gray-100 text-gray-600')}>
                                            <AIcon className="w-2.5 h-2.5" />
                                            {aType?.label || act.type}
                                          </span>
                                          {act.duration && (
                                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                              <Clock className="w-2.5 h-2.5" />
                                              {act.duration}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm font-medium text-[#1A3C5E]">{act.activity}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                          <MapPin className="w-3 h-3" />
                                          {act.location}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => removeActivity(day.day, act.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>

                            {/* Add Activity */}
                            {addingActivity === day.day ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 ml-10 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Time (e.g., 2:00 PM)"
                                    value={newActivity.time}
                                    onChange={(e) => setNewActivity((p) => ({ ...p, time: e.target.value }))}
                                    className="text-sm h-8"
                                  />
                                  <select
                                    value={newActivity.type}
                                    onChange={(e) => setNewActivity((p) => ({ ...p, type: e.target.value as ItineraryActivity['type'] }))}
                                    className="border rounded-md px-2 text-sm h-8 bg-white"
                                  >
                                    {Object.entries(activityTypes).map(([k, v]) => (
                                      <option key={k} value={k}>{v.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <Input
                                  placeholder="Activity description"
                                  value={newActivity.activity}
                                  onChange={(e) => setNewActivity((p) => ({ ...p, activity: e.target.value }))}
                                  className="text-sm h-8"
                                />
                                <Input
                                  placeholder="Location"
                                  value={newActivity.location}
                                  onChange={(e) => setNewActivity((p) => ({ ...p, location: e.target.value }))}
                                  className="text-sm h-8"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" className="h-7 text-xs bg-[#E8733A] hover:bg-[#d4642e]" onClick={() => addItineraryActivity(day.day)}>
                                    Add Activity
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setAddingActivity(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </motion.div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 ml-10 text-xs gap-1 text-[#E8733A] border-[#E8733A]/30 hover:bg-[#E8733A]/5"
                                onClick={() => setAddingActivity(day.day)}
                              >
                                <Plus className="w-3 h-3" /> Add Activity
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ═══════════ PRE-TRIP TAB ═══════════ */}
            <TabsContent value="pretrip" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#1A3C5E]">
                    <ListChecks className="w-5 h-5 text-[#E8733A]" />
                    Pre-Trip Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-5">
                    <Progress value={preTripProgress} variant="accent" className="flex-1 h-2.5" />
                    <span className={cn(
                      'text-sm font-bold',
                      preTripProgress === 100 ? 'text-green-600' : 'text-[#1A3C5E]'
                    )}>
                      {preTripDone}/{preTripList.length}
                    </span>
                    {preTripProgress === 100 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Badge className="bg-green-100 text-green-700 border-green-300">All Done!</Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Categorized Checklist */}
                  <div className="space-y-6">
                    {Object.entries(preTripCategories).map(([catKey, items]) => (
                      <div key={catKey}>
                        <h3 className="text-sm font-semibold text-[#1A3C5E] mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E8733A]" />
                          {catLabels[catKey] || catKey}
                          <Badge variant="outline" className="text-[10px]">
                            {items.filter((i) => i.checked).length}/{items.length}
                          </Badge>
                        </h3>
                        <div className="space-y-1 ml-3">
                          {items.map((item, idx) => {
                            const ItemIcon = item.icon;
                            return (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="flex items-center gap-3 py-2 group cursor-pointer"
                                onClick={() => togglePreTripItem(item.id)}
                              >
                                <motion.div
                                  className={cn(
                                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0',
                                    item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-green-400'
                                  )}
                                  whileTap={{ scale: 1.3 }}
                                >
                                  <AnimatePresence>
                                    {item.checked && (
                                      <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0 }}
                                      >
                                        <Check className="w-3 h-3 text-white" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                                <ItemIcon className={cn('w-4 h-4 shrink-0', item.checked ? 'text-gray-300' : 'text-gray-400')} />
                                <span className={cn(
                                  'text-sm transition-all',
                                  item.checked && 'line-through text-gray-400'
                                )}>
                                  {item.label}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ═══════════ TEMPLATES TAB ═══════════ */}
            <TabsContent value="templates" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-[#1A3C5E]">
                    <Copy className="w-5 h-5 text-[#E8733A]" />
                    Saved Templates
                  </CardTitle>
                  <Button
                    size="sm"
                    className="bg-[#E8733A] hover:bg-[#d4642e] gap-1"
                    onClick={() => setShowSaveTemplate(true)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Current
                  </Button>
                </CardHeader>
                <CardContent>
                  {templates.length === 0 ? (
                    <div className="text-center py-10">
                      <Copy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No saved templates yet</p>
                      <p className="text-xs text-gray-400 mt-1">Generate a packing list and save it as a template</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {templates.map((tmpl, idx) => (
                        <motion.div
                          key={tmpl.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 hover:border-[#E8733A]/30">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-sm text-[#1A3C5E]">{tmpl.name}</h4>
                                <Badge variant="outline" className="text-[10px] shrink-0">
                                  {tmpl.tripType}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-xs text-gray-500">
                                <p className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {tmpl.destination}
                                </p>
                                <p className="flex items-center gap-1">
                                  <Luggage className="w-3 h-3" />
                                  {tmpl.itemCount} items
                                </p>
                                <p className="flex items-center gap-1">
                                  <CalendarDays className="w-3 h-3" />
                                  {new Date(tmpl.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs flex-1 bg-[#E8733A] hover:bg-[#d4642e] gap-1"
                                  onClick={() => {
                                    setDestination(tmpl.destination);
                                    setTripType(tmpl.tripType.toLowerCase());
                                    handleGenerate();
                                    setActiveTab('packing');
                                  }}
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  Use Template
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1"
                                  onClick={handleShare}
                                >
                                  <Share2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1"
                                  onClick={() => {
                                    const data = JSON.stringify({ name: tmpl.name, destination: tmpl.destination, tripType: tmpl.tripType });
                                    const blob = new Blob([data], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${tmpl.name.replace(/\s/g, '-').toLowerCase()}.json`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}
