'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, Heart, Car, Users,
  Scale, Moon, Eye, Fingerprint, Globe2, X, MapPin, Shield,
  Lightbulb, Info, ChevronRight, TrendingUp, TrendingDown,
  CheckCircle, XCircle, ArrowLeftRight, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface NighttimeSafety {
  score: number;
  safeAreas: { name: string; description: string }[];
  avoidAreas: { name: string; reason: string }[];
  lightingQuality: 'excellent' | 'good' | 'moderate' | 'poor';
  tips: string[];
}

interface SafetyData {
  overall: number;
  advisoryLevel: 'safe' | 'caution' | 'avoid-non-essential' | 'do-not-travel';
  advisoryDescription: string;
  lastUpdated: string;
  categories: { name: string; score: number; icon: React.ElementType }[];
  soloFemale: {
    score: number;
    tips: string[];
    safeAreas: string[];
    avoidAreas: string[];
  };
  lgbtq: {
    score: number;
    legal: string;
    safety: string;
    culture: string;
    safeAreas: string[];
  };
  nighttime: NighttimeSafety;
  scams: { name: string; description: string; avoid: string; severity: 'low' | 'medium' | 'high' }[];
  safeZones: { name: string; level: 'safe' | 'caution' | 'avoid'; lat: number; lng: number }[];
}

/* ──────────────── Mock Data ──────────────── */

const safetyDatabase: Record<string, SafetyData> = {
  India: {
    overall: 55,
    advisoryLevel: 'caution',
    advisoryDescription: 'Exercise increased caution. Petty crime and scams targeting tourists are common in major cities. Avoid traveling alone in remote areas at night.',
    lastUpdated: '2026-03-08',
    categories: [
      { name: 'Crime', score: 50, icon: Fingerprint },
      { name: 'Health', score: 50, icon: Heart },
      { name: 'Natural Disasters', score: 45, icon: AlertTriangle },
      { name: 'Infrastructure', score: 48, icon: Car },
      { name: 'Political Stability', score: 60, icon: Scale },
    ],
    soloFemale: {
      score: 40,
      tips: [
        'Avoid traveling alone at night, especially in poorly lit areas',
        'Use verified taxi apps (Ola/Uber) instead of hailing cabs on the street',
        'Dress conservatively in rural areas and religious sites',
        'Share live location with trusted contacts at all times',
        'Carry a personal safety alarm or whistle',
        'Trust your instincts - if a situation feels wrong, leave immediately',
      ],
      safeAreas: ['South Mumbai', 'Bangalore (Indiranagar)', 'Goa (North beaches)', 'Jaipur (tourist areas)', 'Delhi (Khan Market area)'],
      avoidAreas: ['Isolated areas after dark', 'Overcrowded local trains at night', 'Unlicensed accommodations', 'Remote rural areas alone'],
    },
    lgbtq: {
      score: 45,
      legal: 'Decriminalized (Section 377 struck down 2018). No same-sex marriage.',
      safety: 'Generally safe in metro cities. Exercise caution in rural areas and smaller towns.',
      culture: 'Increasing acceptance in urban areas. Public displays of affection are not advisable anywhere. Mumbai and Delhi have growing LGBTQ+ scenes.',
      safeAreas: ['Mumbai (Bandra)', 'Delhi (Hauz Khas)', 'Bangalore', 'Goa'],
    },
    nighttime: {
      score: 42,
      safeAreas: [
        { name: 'Connaught Place, Delhi', description: 'Well-lit commercial area with police presence until late' },
        { name: 'Marine Drive, Mumbai', description: 'Busy promenade with good lighting and crowds' },
        { name: 'MG Road, Bangalore', description: 'Active nightlife area with security' },
      ],
      avoidAreas: [
        { name: 'Old Delhi lanes after 9 PM', reason: 'Poor lighting and narrow streets with few people' },
        { name: 'Isolated railway stations', reason: 'Minimal security and low foot traffic' },
        { name: 'Construction zones', reason: 'Unlit areas with no surveillance' },
      ],
      lightingQuality: 'moderate',
      tips: [
        'Stick to well-lit main roads and busy areas',
        'Use app-based transport for all nighttime travel',
        'Avoid walking alone - travel in groups when possible',
        'Keep emergency numbers saved and easily accessible',
      ],
    },
    scams: [
      { name: 'Taxi Meter Scam', description: 'Drivers claim meter is broken and charge inflated rates.', avoid: 'Use app-based taxis or agree on fare beforehand.', severity: 'high' },
      { name: 'Gem Scam', description: 'Shops offer to sell gems at "wholesale" prices for resale abroad.', avoid: 'Never buy gems from strangers or for "investment".', severity: 'high' },
      { name: 'Fake Tour Guide', description: 'Unofficial guides at tourist sites charge high fees for poor service.', avoid: 'Only use government-licensed guides. Check ID.', severity: 'medium' },
      { name: 'Temple Blessing Scam', description: 'Self-appointed priests at temples demand large donations.', avoid: 'Politely decline. Official temple donations have counters.', severity: 'medium' },
      { name: 'Train Ticket Overcharge', description: 'Agents outside stations sell tickets at 3-5x markup.', avoid: 'Buy tickets from official counters or IRCTC app.', severity: 'low' },
    ],
    safeZones: [
      { name: 'South Mumbai', level: 'safe', lat: 18.92, lng: 72.83 },
      { name: 'Colaba Tourist Area', level: 'safe', lat: 18.91, lng: 72.83 },
      { name: 'Bandra West', level: 'safe', lat: 19.05, lng: 72.83 },
      { name: 'Dharavi', level: 'caution', lat: 19.04, lng: 72.85 },
      { name: 'Kurla Station Area', level: 'caution', lat: 19.07, lng: 72.88 },
      { name: 'Aarey Forest (night)', level: 'avoid', lat: 19.15, lng: 72.87 },
    ],
  },
  Japan: {
    overall: 85,
    advisoryLevel: 'safe',
    advisoryDescription: 'Exercise normal precautions. Japan is one of the safest countries for tourists. Natural disaster preparedness is recommended.',
    lastUpdated: '2026-03-06',
    categories: [
      { name: 'Crime', score: 92, icon: Fingerprint },
      { name: 'Health', score: 90, icon: Heart },
      { name: 'Natural Disasters', score: 55, icon: AlertTriangle },
      { name: 'Infrastructure', score: 95, icon: Car },
      { name: 'Political Stability', score: 92, icon: Scale },
    ],
    soloFemale: {
      score: 75,
      tips: [
        'Women-only train cars available during rush hours',
        'Japan is generally very safe for solo female travelers',
        'Be aware of crowded trains during peak hours',
        'Emergency police boxes (koban) are on almost every corner',
        'Download the Safety Tips app from the Japanese government',
      ],
      safeAreas: ['Tokyo (all areas)', 'Kyoto', 'Osaka (Namba)', 'Okinawa'],
      avoidAreas: ['Kabukicho late at night (touts)', 'Overcrowded trains during rush hour'],
    },
    lgbtq: {
      score: 70,
      legal: 'Legal. No same-sex marriage nationally, some municipalities issue partnership certificates.',
      safety: 'Generally safe. Acceptance varies by region.',
      culture: 'Private culture. PDA uncommon for all couples. Shinjuku Ni-chome is Tokyo\'s LGBTQ+ district.',
      safeAreas: ['Shinjuku Ni-chome (Tokyo)', 'Doyama-cho (Osaka)', 'Kyoto'],
    },
    nighttime: {
      score: 90,
      safeAreas: [
        { name: 'Shibuya, Tokyo', description: 'Vibrant area that stays busy and well-lit until late' },
        { name: 'Dotonbori, Osaka', description: 'Major entertainment district with excellent lighting' },
        { name: 'Gion, Kyoto', description: 'Historic area with good foot traffic and lighting' },
      ],
      avoidAreas: [
        { name: 'Kabukicho back alleys', reason: 'Touts can be persistent and aggressive' },
        { name: 'Roppongi late night bars', reason: 'Drink spiking incidents reported' },
      ],
      lightingQuality: 'excellent',
      tips: [
        'Japan is remarkably safe at night compared to most countries',
        'Convenience stores (konbini) are open 24/7 and serve as safe havens',
        'Trains stop around midnight - plan last train times or budget for taxi',
        'Police boxes (koban) are available 24/7 for assistance',
      ],
    },
    scams: [
      { name: 'Bar Scam', description: 'Friendly locals invite you to a bar where drinks are extremely overpriced.', avoid: 'Be cautious of random invitations. Check prices before ordering.', severity: 'high' },
      { name: 'Temple Fortune Scam', description: 'Overpriced fortune readings or charms at tourist temples.', avoid: 'Official omikuji at temples cost 100-200 yen max.', severity: 'low' },
    ],
    safeZones: [
      { name: 'Shibuya', level: 'safe', lat: 35.66, lng: 139.70 },
      { name: 'Shinjuku (main)', level: 'safe', lat: 35.69, lng: 139.70 },
      { name: 'Asakusa', level: 'safe', lat: 35.71, lng: 139.80 },
      { name: 'Ginza', level: 'safe', lat: 35.67, lng: 139.76 },
      { name: 'Kabukicho', level: 'caution', lat: 35.70, lng: 139.70 },
      { name: 'Roppongi (late)', level: 'caution', lat: 35.66, lng: 139.73 },
    ],
  },
  Thailand: {
    overall: 65,
    advisoryLevel: 'caution',
    advisoryDescription: 'Exercise increased caution. Petty crime and scams are common in tourist areas. Road safety is a significant concern.',
    lastUpdated: '2026-03-01',
    categories: [
      { name: 'Crime', score: 60, icon: Fingerprint },
      { name: 'Health', score: 72, icon: Heart },
      { name: 'Natural Disasters', score: 55, icon: AlertTriangle },
      { name: 'Infrastructure', score: 58, icon: Car },
      { name: 'Political Stability', score: 55, icon: Scale },
    ],
    soloFemale: {
      score: 60,
      tips: [
        'Thailand is popular with solo female travelers',
        'Stick to well-lit areas at night',
        'Be cautious with drinks at bars - never leave drinks unattended',
        'Use registered taxis and Grab app for all transport',
        'Dress modestly when visiting temples',
      ],
      safeAreas: ['Bangkok (Sukhumvit)', 'Chiang Mai Old City', 'Koh Samui', 'Phuket Town'],
      avoidAreas: ['Patpong after midnight', 'Isolated beaches at night', 'Walking Street, Pattaya alone at night'],
    },
    lgbtq: {
      score: 78,
      legal: 'Legal. Same-sex marriage bill passed in 2024.',
      safety: 'Very accepting culture. Bangkok has vibrant LGBTQ+ scene.',
      culture: 'One of the most LGBTQ+ friendly countries in Asia. Silom Soi 4 in Bangkok is the main LGBTQ+ area.',
      safeAreas: ['Bangkok (Silom)', 'Chiang Mai', 'Pattaya', 'Phuket'],
    },
    nighttime: {
      score: 55,
      safeAreas: [
        { name: 'Sukhumvit Road, Bangkok', description: 'Major tourist strip with good lighting and BTS access' },
        { name: 'Nimman Road, Chiang Mai', description: 'Trendy area with cafes and restaurants open late' },
        { name: 'Walking Street, Phuket', description: 'Tourist area with security and good lighting' },
      ],
      avoidAreas: [
        { name: 'Klong Toei area, Bangkok', reason: 'High crime area with poor infrastructure' },
        { name: 'Beach areas after midnight', reason: 'Isolated with no lighting or security' },
        { name: 'Soi Cowboy back alleys', reason: 'Scams and drink spiking reported' },
      ],
      lightingQuality: 'moderate',
      tips: [
        'Full moon parties require extra caution - stay with your group',
        'Use Grab rather than tuk-tuks for late night transport',
        'Avoid motorbike taxis at night - they often lack helmets',
        'Tourist police hotline: 1155 - available 24/7',
      ],
    },
    scams: [
      { name: 'Tuk-Tuk Scam', description: 'Drivers offer cheap rides but take you to gem/suit shops for commission.', avoid: 'Decline shopping detours. Use Grab instead.', severity: 'high' },
      { name: 'Jet Ski Damage Scam', description: 'Rental operators claim pre-existing damage was caused by you.', avoid: 'Photograph equipment before use. Use reputable operators.', severity: 'high' },
      { name: 'Grand Palace Closed Scam', description: 'Touts say the palace is closed today and offer alternative tours.', avoid: 'The palace is rarely closed. Go directly to the entrance.', severity: 'medium' },
      { name: 'Ping Pong Show Scam', description: 'Quoted a low price then given a massive bill including extras.', avoid: 'Avoid these shows. Bills can run into thousands of baht.', severity: 'high' },
    ],
    safeZones: [
      { name: 'Sukhumvit', level: 'safe', lat: 13.73, lng: 100.56 },
      { name: 'Silom', level: 'safe', lat: 13.73, lng: 100.53 },
      { name: 'Old City (Rattanakosin)', level: 'safe', lat: 13.75, lng: 100.49 },
      { name: 'Khaosan Road', level: 'caution', lat: 13.76, lng: 100.50 },
      { name: 'Klong Toei', level: 'avoid', lat: 13.71, lng: 100.56 },
      { name: 'Pratunam (crowded markets)', level: 'caution', lat: 13.75, lng: 100.54 },
    ],
  },
  France: {
    overall: 72,
    advisoryLevel: 'caution',
    advisoryDescription: 'Exercise increased caution due to terrorism risk and petty crime in major tourist areas. Pickpocketing is a significant concern in Paris.',
    lastUpdated: '2026-03-04',
    categories: [
      { name: 'Crime', score: 68, icon: Fingerprint },
      { name: 'Health', score: 92, icon: Heart },
      { name: 'Natural Disasters', score: 85, icon: AlertTriangle },
      { name: 'Infrastructure', score: 88, icon: Car },
      { name: 'Political Stability', score: 72, icon: Scale },
    ],
    soloFemale: {
      score: 65,
      tips: [
        'Use well-lit metro stations at night',
        'Be aware of pickpockets in tourist areas',
        'Paris is generally safe, exercise normal caution',
        'Keep valuables secure on public transport',
        'Avoid the RER late at night - use taxis instead',
      ],
      safeAreas: ['Le Marais (Paris)', 'Saint-Germain', 'Nice Old Town', 'Lyon Centre'],
      avoidAreas: ['Gare du Nord at night', 'Bois de Boulogne after dark', 'Certain northern suburbs alone'],
    },
    lgbtq: {
      score: 80,
      legal: 'Same-sex marriage legal since 2013. Strong anti-discrimination laws.',
      safety: 'Generally very accepting, especially in cities. Occasional incidents reported.',
      culture: 'Le Marais in Paris is the historic LGBTQ+ district. Pride events are large and well-attended.',
      safeAreas: ['Le Marais (Paris)', 'Montpellier', 'Lyon', 'Nice'],
    },
    nighttime: {
      score: 62,
      safeAreas: [
        { name: 'Champs-Elysees, Paris', description: 'Well-patrolled, brightly lit main avenue' },
        { name: 'Vieux Port, Marseille', description: 'Popular waterfront area with restaurants' },
        { name: 'Presqu\'ile, Lyon', description: 'Central peninsula with good nightlife and lighting' },
      ],
      avoidAreas: [
        { name: 'Gare du Nord surroundings', reason: 'Known for pickpocketing and harassment' },
        { name: 'Bois de Boulogne', reason: 'Isolated park area, unsafe after dark' },
        { name: 'Seine riverbanks (isolated stretches)', reason: 'Dark areas with limited visibility' },
      ],
      lightingQuality: 'good',
      tips: [
        'Paris Metro is generally safe but avoid empty cars late at night',
        'Be vigilant around major tourist sites - pickpockets work in groups',
        'Keep your phone secure - snatch thefts are common',
        'Emergency number: 112 (EU universal emergency)',
      ],
    },
    scams: [
      { name: 'Petition Scam', description: 'Groups ask you to sign a petition while an accomplice pickpockets you.', avoid: 'Politely decline and keep walking. Keep hands on your belongings.', severity: 'high' },
      { name: 'Ring Scam', description: 'Someone "finds" a gold ring and offers to sell it to you.', avoid: 'Ignore and walk away. The ring is always worthless.', severity: 'medium' },
      { name: 'Bracelet Scam', description: 'Someone ties a bracelet on your wrist then demands payment.', avoid: 'Keep hands in pockets near Sacre-Coeur. Firmly say no.', severity: 'medium' },
      { name: 'Fake Charity Workers', description: 'People with clipboards approach for "charity" donations while others pickpocket.', avoid: 'Never stop walking. Official charities don\'t solicit on the street like this.', severity: 'low' },
    ],
    safeZones: [
      { name: 'Le Marais', level: 'safe', lat: 48.86, lng: 2.36 },
      { name: 'Saint-Germain-des-Pres', level: 'safe', lat: 48.85, lng: 2.33 },
      { name: 'Montmartre (day)', level: 'safe', lat: 48.89, lng: 2.34 },
      { name: 'Gare du Nord area', level: 'caution', lat: 48.88, lng: 2.36 },
      { name: 'Montmartre (night)', level: 'caution', lat: 48.89, lng: 2.34 },
      { name: 'Bois de Boulogne', level: 'avoid', lat: 48.86, lng: 2.25 },
    ],
  },
  Brazil: {
    overall: 42,
    advisoryLevel: 'avoid-non-essential',
    advisoryDescription: 'Reconsider travel to certain areas. Violent crime, including armed robbery, carjacking, and express kidnapping, is widespread. Exercise extreme caution in all areas.',
    lastUpdated: '2026-03-07',
    categories: [
      { name: 'Crime', score: 30, icon: Fingerprint },
      { name: 'Health', score: 55, icon: Heart },
      { name: 'Natural Disasters', score: 65, icon: AlertTriangle },
      { name: 'Infrastructure', score: 45, icon: Car },
      { name: 'Political Stability', score: 45, icon: Scale },
    ],
    soloFemale: {
      score: 35,
      tips: [
        'Avoid displaying jewelry, electronics, or expensive items',
        'Use registered taxis or Uber/99 exclusively - never hail cabs',
        'Stay in well-populated areas at all times',
        'Learn basic Portuguese phrases for emergencies',
        'Avoid ATMs on the street - use ones inside shopping malls',
        'Do not resist if robbed - compliance is the safest approach',
      ],
      safeAreas: ['Ipanema (Rio)', 'Jardins (Sao Paulo)', 'Barra da Tijuca', 'Florianopolis South'],
      avoidAreas: ['Favelas without an authorized guide', 'Copacabana beach at night', 'Downtown areas after dark', 'Bus stations at night'],
    },
    lgbtq: {
      score: 42,
      legal: 'Same-sex marriage legal since 2013. Anti-discrimination protections exist.',
      safety: 'Mixed environment. Progressive laws but violence against LGBTQ+ individuals persists.',
      culture: 'Sao Paulo Pride is one of the world\'s largest. Cities generally more accepting than rural areas.',
      safeAreas: ['Vila Madalena (Sao Paulo)', 'Ipanema (Rio)', 'Florianopolis'],
    },
    nighttime: {
      score: 28,
      safeAreas: [
        { name: 'Jardins, Sao Paulo', description: 'Upscale neighborhood with security and good lighting' },
        { name: 'Barra da Tijuca, Rio', description: 'Modern area with shopping malls and residential security' },
        { name: 'Pelourinho, Salvador (main area)', description: 'Tourist area with police presence' },
      ],
      avoidAreas: [
        { name: 'Copacabana Beach (after dark)', reason: 'Armed robberies and muggings are common' },
        { name: 'Centro, Rio (after business hours)', reason: 'Deserted streets with high crime rate' },
        { name: 'Bus stations and terminals', reason: 'High incidence of theft and assault' },
      ],
      lightingQuality: 'poor',
      tips: [
        'Avoid walking anywhere at night - always use rideshare apps',
        'Do not carry large amounts of cash or expensive items',
        'Keep a "decoy wallet" with small bills if walking',
        'Stay in your hotel or resort area after dark',
      ],
    },
    scams: [
      { name: 'Express Kidnapping', description: 'Victims forced to make ATM withdrawals by armed criminals.', avoid: 'Use ATMs inside banks during business hours only.', severity: 'high' },
      { name: 'Fake Police', description: 'Criminals posing as police demanding to check your wallet.', avoid: 'Ask for badge ID. Real police rarely check wallets on the street.', severity: 'high' },
      { name: 'Beach Theft', description: 'Belongings stolen from the beach while swimming.', avoid: 'Never leave valuables unattended. Use waterproof pouches.', severity: 'medium' },
      { name: 'Distraction Robbery', description: 'Someone spills something on you while accomplice steals your bag.', avoid: 'Keep belongings in front of you. Move away immediately if approached.', severity: 'high' },
    ],
    safeZones: [
      { name: 'Ipanema', level: 'safe', lat: -22.98, lng: -43.20 },
      { name: 'Jardins, Sao Paulo', level: 'safe', lat: -23.57, lng: -46.66 },
      { name: 'Copacabana (day)', level: 'caution', lat: -22.97, lng: -43.19 },
      { name: 'Santa Teresa', level: 'caution', lat: -22.92, lng: -43.19 },
      { name: 'Centro at night', level: 'avoid', lat: -22.91, lng: -43.18 },
      { name: 'Favelas', level: 'avoid', lat: -22.95, lng: -43.24 },
    ],
  },
};

const countryList = Object.keys(safetyDatabase);

/* ──────────────── Helpers ──────────────── */

const scoreColor = (score: number) => {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
};

const scoreBg = (score: number) => {
  if (score >= 70) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

const scoreBgLight = (score: number) => {
  if (score >= 70) return 'bg-green-50 border-green-200';
  if (score >= 50) return 'bg-yellow-50 border-yellow-200';
  if (score >= 30) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
};

const gaugeColor = (score: number) => {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#eab308';
  if (score >= 30) return '#f97316';
  return '#ef4444';
};

const scoreLabel = (score: number) => {
  if (score >= 70) return 'Generally Safe';
  if (score >= 50) return 'Moderate Risk';
  if (score >= 30) return 'Elevated Risk';
  return 'High Risk';
};

const advisoryConfig: Record<string, { bg: string; border: string; text: string; label: string; iconColor: string }> = {
  'safe': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', label: 'Safe', iconColor: 'text-green-600' },
  'caution': { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800', label: 'Exercise Caution', iconColor: 'text-yellow-600' },
  'avoid-non-essential': { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', label: 'Avoid Non-Essential Travel', iconColor: 'text-orange-600' },
  'do-not-travel': { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', label: 'Do Not Travel', iconColor: 'text-red-600' },
};

const lightingConfig: Record<string, { label: string; color: string; bg: string }> = {
  excellent: { label: 'Excellent', color: 'text-green-700', bg: 'bg-green-100' },
  good: { label: 'Good', color: 'text-blue-700', bg: 'bg-blue-100' },
  moderate: { label: 'Moderate', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  poor: { label: 'Poor', color: 'text-red-700', bg: 'bg-red-100' },
};

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Low Risk', color: 'text-green-700', bg: 'bg-green-100' },
  medium: { label: 'Medium Risk', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  high: { label: 'High Risk', color: 'text-red-700', bg: 'bg-red-100' },
};

const zoneConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  safe: { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300', label: 'Safe' },
  caution: { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-300', label: 'Caution' },
  avoid: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', label: 'Avoid' },
};

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ──────────────── Loading Skeleton ──────────────── */

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-gray-200 animate-pulse" />
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="h-11 w-72 rounded-xl bg-gray-200 animate-pulse" />
      <Card>
        <CardContent className="p-8 flex flex-col items-center gap-4">
          <div className="w-52 h-52 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-6 w-12 rounded bg-gray-200 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="h-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-20 rounded bg-gray-200 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ──────────────── Main Component ──────────────── */

export default function SafetyPage() {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [compareA, setCompareA] = useState('India');
  const [compareB, setCompareB] = useState('Japan');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Simulate loading on country change
  const handleCountryChange = (country: string) => {
    setIsLoading(true);
    setSelectedCountry(country);
    setTimeout(() => setIsLoading(false), 400);
  };

  const data = safetyDatabase[selectedCountry];
  const compareDataA = safetyDatabase[compareA];
  const compareDataB = safetyDatabase[compareB];

  const overallScore = data?.overall ?? 0;
  const circumference = 2 * Math.PI * 70;
  const strokeDash = (overallScore / 100) * circumference;
  const advisory = advisoryConfig[data?.advisoryLevel ?? 'caution'];

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E] flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-[#E8733A]" />
          Safety Scores
        </h1>
        <p className="text-gray-500 text-sm mt-1">Comprehensive safety information for travelers</p>
      </motion.div>

      {/* Country Selector */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full sm:w-72 h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
        >
          {countryList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </motion.div>

      {/* Travel Advisory Banner */}
      <motion.div {...fadeIn} transition={{ delay: 0.08 }}>
        <div className={cn('rounded-xl border-2 p-4 sm:p-5', advisory.bg, advisory.border)}>
          <div className="flex items-start gap-3">
            <div className={cn('shrink-0 mt-0.5', advisory.iconColor)}>
              {data.advisoryLevel === 'safe' ? (
                <CheckCircle className="w-6 h-6" />
              ) : data.advisoryLevel === 'do-not-travel' ? (
                <XCircle className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className={cn('font-bold text-sm', advisory.text)}>Travel Advisory: {advisory.label}</h3>
                <Badge className={cn('text-[10px]', advisory.text, advisory.bg, advisory.border)}>
                  {selectedCountry}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{data.advisoryDescription}</p>
              <p className="text-[10px] text-gray-400 mt-2">
                Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          {/* Advisory level indicator bar */}
          <div className="mt-4 flex items-center gap-1">
            {(['safe', 'caution', 'avoid-non-essential', 'do-not-travel'] as const).map((level) => (
              <div
                key={level}
                className={cn(
                  'flex-1 h-2 rounded-full transition-all',
                  data.advisoryLevel === level ? 'ring-2 ring-offset-1' : 'opacity-40',
                  level === 'safe' ? 'bg-green-500 ring-green-500' :
                  level === 'caution' ? 'bg-yellow-500 ring-yellow-500' :
                  level === 'avoid-non-essential' ? 'bg-orange-500 ring-orange-500' :
                  'bg-red-500 ring-red-500'
                )}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-400">Safe</span>
            <span className="text-[9px] text-gray-400">Caution</span>
            <span className="text-[9px] text-gray-400">Avoid</span>
            <span className="text-[9px] text-gray-400">Do Not Travel</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs for main content */}
      <Tabs defaultValue="overview" className="w-full">
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <TabsList className="w-full sm:w-auto flex flex-wrap gap-1">
            <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
              <Shield className="w-3.5 h-3.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="demographics" className="gap-1.5 text-xs sm:text-sm">
              <Users className="w-3.5 h-3.5" /> Demographics
            </TabsTrigger>
            <TabsTrigger value="nighttime" className="gap-1.5 text-xs sm:text-sm">
              <Moon className="w-3.5 h-3.5" /> Nighttime
            </TabsTrigger>
            <TabsTrigger value="scams" className="gap-1.5 text-xs sm:text-sm">
              <Eye className="w-3.5 h-3.5" /> Scams
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-1.5 text-xs sm:text-sm">
              <ArrowLeftRight className="w-3.5 h-3.5" /> Compare
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-1.5 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5" /> Safe Areas
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* ────── Overview Tab ────── */}
        <TabsContent value="overview">
          <div className="space-y-6 mt-4">
            {/* Overall Safety Gauge */}
            <motion.div {...fadeIn} transition={{ delay: 0.12 }}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Gauge */}
                    <div className="flex flex-col items-center">
                      <h2 className="text-lg font-bold text-[#1A3C5E] mb-4">Overall Safety Score</h2>
                      <div className="relative w-44 h-44 sm:w-52 sm:h-52">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                          <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                          <motion.circle
                            cx="80" cy="80" r="70" fill="none"
                            stroke={gaugeColor(overallScore)}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference - strokeDash }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={cn('text-4xl sm:text-5xl font-bold', scoreColor(overallScore))}>
                            {overallScore}
                          </span>
                          <span className="text-xs text-gray-400">/ 100</span>
                        </div>
                      </div>
                      <p className={cn('text-sm font-medium mt-3', scoreColor(overallScore))}>
                        {scoreLabel(overallScore)}
                      </p>
                    </div>

                    {/* Quick stats */}
                    <div className="flex-1 w-full">
                      <h3 className="text-sm font-bold text-[#1A3C5E] mb-3">Quick Safety Summary</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className={cn('rounded-xl p-3 border', scoreBgLight(data.soloFemale.score))}>
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Female Traveler</p>
                          <p className={cn('text-2xl font-bold', scoreColor(data.soloFemale.score))}>{data.soloFemale.score}</p>
                        </div>
                        <div className={cn('rounded-xl p-3 border', scoreBgLight(data.lgbtq.score))}>
                          <p className="text-[10px] font-bold text-gray-500 uppercase">LGBTQ+ Safety</p>
                          <p className={cn('text-2xl font-bold', scoreColor(data.lgbtq.score))}>{data.lgbtq.score}</p>
                        </div>
                        <div className={cn('rounded-xl p-3 border', scoreBgLight(data.nighttime.score))}>
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Nighttime Safety</p>
                          <p className={cn('text-2xl font-bold', scoreColor(data.nighttime.score))}>{data.nighttime.score}</p>
                        </div>
                        <div className={cn('rounded-xl p-3 border', scoreBgLight(data.categories.find(c => c.name === 'Crime')?.score ?? 0))}>
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Crime Safety</p>
                          <p className={cn('text-2xl font-bold', scoreColor(data.categories.find(c => c.name === 'Crime')?.score ?? 0))}>{data.categories.find(c => c.name === 'Crime')?.score ?? 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
              <h2 className="text-lg font-bold text-[#1A3C5E] mb-3">Category Breakdown</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {data.categories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.04 }}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', scoreBgLight(cat.score))}>
                              <Icon className={cn('w-4 h-4', scoreColor(cat.score))} />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('text-2xl font-bold', scoreColor(cat.score))}>{cat.score}</span>
                            <span className="text-[10px] text-gray-400">/100</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.score}%` }}
                              transition={{ duration: 0.6, delay: 0.15 + i * 0.04 }}
                              className={cn('h-full rounded-full', scoreBg(cat.score))}
                            />
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

        {/* ────── Demographics Tab (Solo Female + LGBTQ+) ────── */}
        <TabsContent value="demographics">
          <div className="space-y-6 mt-4">
            {/* Solo Female Safety */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="border-pink-200">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-pink-700">
                      <Users className="w-5 h-5" />
                      Solo Female Traveler Safety
                    </CardTitle>
                    <Badge className={cn('w-fit text-sm px-3 py-1', data.soloFemale.score >= 60 ? 'bg-green-100 text-green-700' : data.soloFemale.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>
                      Score: {data.soloFemale.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={data.soloFemale.score} className="h-3" />
                    </div>
                    <span className={cn('text-sm font-bold', scoreColor(data.soloFemale.score))}>
                      {scoreLabel(data.soloFemale.score)}
                    </span>
                  </div>

                  {/* Tips */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      Safety Tips
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.soloFemale.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          className="flex items-start gap-2 p-2.5 rounded-lg bg-pink-50/50 border border-pink-100"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600 leading-relaxed">{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Safe / Avoid areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-[10px] font-bold text-green-700 uppercase mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Safe Areas
                      </p>
                      <div className="space-y-1.5">
                        {data.soloFemale.safeAreas.map((a) => (
                          <p key={a} className="text-xs text-green-600 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 shrink-0" /> {a}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <p className="text-[10px] font-bold text-red-700 uppercase mb-2 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Areas to Avoid
                      </p>
                      <div className="space-y-1.5">
                        {data.soloFemale.avoidAreas.map((a) => (
                          <p key={a} className="text-xs text-red-600 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 shrink-0" /> {a}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* LGBTQ+ Safety */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="border-purple-200">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                      <Heart className="w-5 h-5" />
                      LGBTQ+ Safety Index
                    </CardTitle>
                    <Badge className={cn('w-fit text-sm px-3 py-1', data.lgbtq.score >= 60 ? 'bg-green-100 text-green-700' : data.lgbtq.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>
                      Score: {data.lgbtq.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={data.lgbtq.score} className="h-3" />
                    </div>
                    <span className={cn('text-sm font-bold', scoreColor(data.lgbtq.score))}>
                      {scoreLabel(data.lgbtq.score)}
                    </span>
                  </div>

                  {/* Info cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Scale className="w-4 h-4 text-purple-500" />
                        <p className="text-[10px] font-bold text-purple-700 uppercase">Legal Status</p>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.lgbtq.legal}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <p className="text-[10px] font-bold text-purple-700 uppercase">Safety Level</p>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.lgbtq.safety}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Globe2 className="w-4 h-4 text-purple-500" />
                        <p className="text-[10px] font-bold text-purple-700 uppercase">Social Acceptance</p>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.lgbtq.culture}</p>
                    </div>
                  </div>

                  {/* Safe Areas */}
                  {data.lgbtq.safeAreas.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-[10px] font-bold text-green-700 uppercase mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> LGBTQ+ Friendly Areas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.lgbtq.safeAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-xs bg-white text-green-700 border-green-300">
                            <MapPin className="w-3 h-3 mr-1" /> {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ────── Nighttime Safety Tab ────── */}
        <TabsContent value="nighttime">
          <div className="space-y-6 mt-4">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-[#1A3C5E]">
                      <Moon className="w-5 h-5 text-indigo-500" />
                      Nighttime Safety - {selectedCountry}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('text-sm px-3 py-1', data.nighttime.score >= 60 ? 'bg-green-100 text-green-700' : data.nighttime.score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>
                        Score: {data.nighttime.score}/100
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Score gauge + lighting quality */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                        <motion.circle
                          cx="80" cy="80" r="70" fill="none"
                          stroke={gaugeColor(data.nighttime.score)}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset: circumference - (data.nighttime.score / 100) * circumference }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Moon className="w-5 h-5 text-indigo-400 mb-1" />
                        <span className={cn('text-2xl font-bold', scoreColor(data.nighttime.score))}>
                          {data.nighttime.score}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500">Street Lighting Quality:</span>
                        <Badge className={cn('text-xs', lightingConfig[data.nighttime.lightingQuality].bg, lightingConfig[data.nighttime.lightingQuality].color)}>
                          {lightingConfig[data.nighttime.lightingQuality].label}
                        </Badge>
                      </div>
                      <p className={cn('text-sm font-medium', scoreColor(data.nighttime.score))}>
                        {data.nighttime.score >= 70 ? 'Generally safe to walk at night in main areas' :
                          data.nighttime.score >= 50 ? 'Use caution when out after dark' :
                          data.nighttime.score >= 30 ? 'Avoid walking alone at night' :
                          'Strongly advised to stay indoors after dark'}
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                    <p className="text-[10px] font-bold text-indigo-700 uppercase mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Nighttime Tips
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.nighttime.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600 leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safe / Avoid at night */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Safe Areas After Dark
                      </p>
                      <div className="space-y-2">
                        {data.nighttime.safeAreas.map((area, i) => (
                          <motion.div
                            key={area.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-green-50 rounded-lg p-3 border border-green-200"
                          >
                            <p className="text-sm font-semibold text-green-800">{area.name}</p>
                            <p className="text-xs text-green-600 mt-0.5">{area.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-700 uppercase mb-2 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Areas to Avoid at Night
                      </p>
                      <div className="space-y-2">
                        {data.nighttime.avoidAreas.map((area, i) => (
                          <motion.div
                            key={area.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-red-50 rounded-lg p-3 border border-red-200"
                          >
                            <p className="text-sm font-semibold text-red-800">{area.name}</p>
                            <p className="text-xs text-red-600 mt-0.5">{area.reason}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ────── Scams Tab ────── */}
        <TabsContent value="scams">
          <div className="space-y-6 mt-4">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Common Scams - {selectedCountry}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.scams.length} known scam{data.scams.length !== 1 ? 's' : ''} targeting tourists in this destination
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.scams.map((scam, i) => {
                      const sev = severityConfig[scam.severity];
                      return (
                        <motion.div
                          key={scam.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                          className="rounded-xl border border-amber-200 overflow-hidden"
                        >
                          <div className="bg-amber-50 p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <h4 className="font-bold text-sm text-amber-800">{scam.name}</h4>
                              </div>
                              <Badge className={cn('text-[10px] shrink-0', sev.bg, sev.color)}>
                                {sev.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-amber-700 mt-2 leading-relaxed">{scam.description}</p>
                          </div>
                          <div className="bg-green-50 p-3 border-t border-amber-200">
                            <div className="flex items-start gap-2">
                              <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold text-green-700 uppercase">How to Avoid</p>
                                <p className="text-xs text-green-600 mt-0.5">{scam.avoid}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* General scam avoidance tips */}
                  <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> General Tips to Avoid Scams
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Never share personal information with strangers',
                        'If a deal seems too good to be true, it is',
                        'Research common scams before arriving at your destination',
                        'Keep copies of important documents in a separate location',
                        'Use official transportation services and verified apps',
                        'Trust your instincts - walk away if uncomfortable',
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ────── Compare Tab ────── */}
        <TabsContent value="compare">
          <div className="space-y-6 mt-4">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-[#E8733A]" />
                    Safety Comparison Tool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Selectors */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                    <select
                      value={compareA}
                      onChange={(e) => setCompareA(e.target.value)}
                      className="w-full sm:w-48 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                    >
                      {countryList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1A3C5E] flex items-center justify-center">
                        <ArrowLeftRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <select
                      value={compareB}
                      onChange={(e) => setCompareB(e.target.value)}
                      className="w-full sm:w-48 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A]"
                    >
                      {countryList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {compareA !== compareB ? (
                    <div className="space-y-4">
                      {/* Overall comparison */}
                      <div className="grid grid-cols-3 gap-4 items-center text-center p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">{compareA}</p>
                          <p className={cn('text-3xl font-bold', scoreColor(compareDataA.overall))}>{compareDataA.overall}</p>
                          <p className={cn('text-xs font-medium', scoreColor(compareDataA.overall))}>{scoreLabel(compareDataA.overall)}</p>
                        </div>
                        <div className="text-gray-300">
                          <p className="text-xs text-gray-400 uppercase font-bold">Overall</p>
                          <p className="text-lg">vs</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">{compareB}</p>
                          <p className={cn('text-3xl font-bold', scoreColor(compareDataB.overall))}>{compareDataB.overall}</p>
                          <p className={cn('text-xs font-medium', scoreColor(compareDataB.overall))}>{scoreLabel(compareDataB.overall)}</p>
                        </div>
                      </div>

                      {/* Category-by-category comparison */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-3 font-semibold text-gray-600 text-xs">Category</th>
                              <th className="text-center py-3 px-3 font-semibold text-[#1A3C5E] text-xs">{compareA}</th>
                              <th className="text-center py-3 px-3 text-gray-400 text-xs">Diff</th>
                              <th className="text-center py-3 px-3 font-semibold text-[#1A3C5E] text-xs">{compareB}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {compareDataA.categories.map((cat) => {
                              const scoreA = cat.score;
                              const scoreB_ = compareDataB.categories.find((x) => x.name === cat.name)?.score ?? 0;
                              const diff = scoreA - scoreB_;
                              const Icon = cat.icon;
                              return (
                                <tr key={cat.name} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-3 text-gray-600 text-xs flex items-center gap-1.5">
                                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                                    {cat.name}
                                  </td>
                                  <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(scoreA))}>
                                    {scoreA}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <span className={cn(
                                      'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded',
                                      diff > 0 ? 'text-green-700 bg-green-50' :
                                      diff < 0 ? 'text-red-700 bg-red-50' :
                                      'text-gray-500 bg-gray-50'
                                    )}>
                                      {diff > 0 ? <TrendingUp className="w-3 h-3" /> : diff < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                                      {diff > 0 ? `+${diff}` : diff === 0 ? '0' : diff}
                                    </span>
                                  </td>
                                  <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(scoreB_))}>
                                    {scoreB_}
                                  </td>
                                </tr>
                              );
                            })}
                            {/* Additional comparisons */}
                            <tr className="border-b border-gray-100 hover:bg-gray-50 bg-pink-50/30">
                              <td className="py-3 px-3 text-gray-600 text-xs flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-pink-400" />
                                Solo Female Safety
                              </td>
                              <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(compareDataA.soloFemale.score))}>
                                {compareDataA.soloFemale.score}
                              </td>
                              <td className="py-3 px-3 text-center">
                                {(() => {
                                  const d = compareDataA.soloFemale.score - compareDataB.soloFemale.score;
                                  return (
                                    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded', d > 0 ? 'text-green-700 bg-green-50' : d < 0 ? 'text-red-700 bg-red-50' : 'text-gray-500 bg-gray-50')}>
                                      {d > 0 ? <TrendingUp className="w-3 h-3" /> : d < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                                      {d > 0 ? `+${d}` : d === 0 ? '0' : d}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(compareDataB.soloFemale.score))}>
                                {compareDataB.soloFemale.score}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 bg-purple-50/30">
                              <td className="py-3 px-3 text-gray-600 text-xs flex items-center gap-1.5">
                                <Heart className="w-3.5 h-3.5 text-purple-400" />
                                LGBTQ+ Safety
                              </td>
                              <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(compareDataA.lgbtq.score))}>
                                {compareDataA.lgbtq.score}
                              </td>
                              <td className="py-3 px-3 text-center">
                                {(() => {
                                  const d = compareDataA.lgbtq.score - compareDataB.lgbtq.score;
                                  return (
                                    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded', d > 0 ? 'text-green-700 bg-green-50' : d < 0 ? 'text-red-700 bg-red-50' : 'text-gray-500 bg-gray-50')}>
                                      {d > 0 ? <TrendingUp className="w-3 h-3" /> : d < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                                      {d > 0 ? `+${d}` : d === 0 ? '0' : d}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(compareDataB.lgbtq.score))}>
                                {compareDataB.lgbtq.score}
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50 bg-indigo-50/30">
                              <td className="py-3 px-3 text-gray-600 text-xs flex items-center gap-1.5">
                                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                                Nighttime Safety
                              </td>
                              <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(compareDataA.nighttime.score))}>
                                {compareDataA.nighttime.score}
                              </td>
                              <td className="py-3 px-3 text-center">
                                {(() => {
                                  const d = compareDataA.nighttime.score - compareDataB.nighttime.score;
                                  return (
                                    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded', d > 0 ? 'text-green-700 bg-green-50' : d < 0 ? 'text-red-700 bg-red-50' : 'text-gray-500 bg-gray-50')}>
                                      {d > 0 ? <TrendingUp className="w-3 h-3" /> : d < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                                      {d > 0 ? `+${d}` : d === 0 ? '0' : d}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className={cn('py-3 px-3 text-center font-bold text-sm', scoreColor(compareDataB.nighttime.score))}>
                                {compareDataB.nighttime.score}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Visual bar comparison */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Visual Comparison</p>
                        <div className="space-y-3">
                          {['Overall', ...compareDataA.categories.map(c => c.name)].map((name) => {
                            const sA = name === 'Overall' ? compareDataA.overall : (compareDataA.categories.find(c => c.name === name)?.score ?? 0);
                            const sB = name === 'Overall' ? compareDataB.overall : (compareDataB.categories.find(c => c.name === name)?.score ?? 0);
                            return (
                              <div key={name}>
                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                  <span>{compareA}: {sA}</span>
                                  <span className="font-medium">{name}</span>
                                  <span>{compareB}: {sB}</span>
                                </div>
                                <div className="flex gap-1 h-2.5">
                                  <div className="flex-1 bg-gray-200 rounded-full overflow-hidden flex justify-end">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${sA}%` }}
                                      transition={{ duration: 0.6 }}
                                      className={cn('h-full rounded-full', scoreBg(sA))}
                                    />
                                  </div>
                                  <div className="flex-1 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${sB}%` }}
                                      transition={{ duration: 0.6 }}
                                      className={cn('h-full rounded-full', scoreBg(sB))}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ArrowLeftRight className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Select two different countries to compare their safety scores</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ────── Safe Areas Map Tab ────── */}
        <TabsContent value="map">
          <div className="space-y-6 mt-4">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#E8733A]" />
                    Safe Areas Map - {selectedCountry}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Map placeholder */}
                  <div className="relative h-64 sm:h-80 bg-gradient-to-br from-[#1A3C5E]/5 to-[#1A3C5E]/10 rounded-xl border border-dashed border-gray-300 overflow-hidden mb-6">
                    {/* Simulated map with zone pins */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full p-4">
                        {data.safeZones.map((zone, i) => {
                          const config = zoneConfig[zone.level];
                          // Distribute pins across the placeholder area
                          const x = 15 + ((i * 37 + 13) % 70);
                          const y = 15 + ((i * 29 + 7) % 65);
                          return (
                            <motion.div
                              key={zone.name}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15 + i * 0.08 }}
                              className="absolute group"
                              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                            >
                              <div className={cn(
                                'w-4 h-4 rounded-full border-2 shadow-md cursor-pointer transition-transform hover:scale-150',
                                zone.level === 'safe' ? 'bg-green-500 border-green-300' :
                                zone.level === 'caution' ? 'bg-yellow-500 border-yellow-300' :
                                'bg-red-500 border-red-300'
                              )} />
                              {/* Tooltip */}
                              <div className={cn(
                                'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 border',
                                config.bg, config.border, config.color
                              )}>
                                <p className="font-bold">{zone.name}</p>
                                <p className="text-[10px]">{config.label}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                        <div className="absolute bottom-3 left-3 text-xs text-gray-400">
                          <MapPin className="w-5 h-5 inline text-gray-300" /> Conceptual map view - hover over pins for details
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase">Zone Legend:</span>
                    {Object.entries(zoneConfig).map(([key, config]) => (
                      <span key={key} className="flex items-center gap-1.5 text-xs">
                        <span className={cn(
                          'w-3 h-3 rounded-full',
                          key === 'safe' ? 'bg-green-500' :
                          key === 'caution' ? 'bg-yellow-500' :
                          'bg-red-500'
                        )} />
                        <span className={config.color}>{config.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* Zone list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {data.safeZones.map((zone, i) => {
                      const config = zoneConfig[zone.level];
                      return (
                        <motion.div
                          key={zone.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn('rounded-xl p-3 border', config.bg, config.border)}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={cn('w-4 h-4', config.color)} />
                            <span className="text-sm font-semibold text-gray-800">{zone.name}</span>
                          </div>
                          <Badge className={cn('mt-1.5 text-[10px]', config.bg, config.color, config.border)}>
                            {config.label}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
