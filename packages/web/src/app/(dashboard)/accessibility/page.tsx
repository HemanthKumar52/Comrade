'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility, Eye, Ear, Heart, Save, CheckCircle,
  MapPin, Star, Search, Volume2, Vibrate, Subtitles,
  Navigation, Contrast, Type, MonitorSmartphone, Users,
  Shield, Clock, Pill, Share2, ChevronDown, ChevronUp,
  UtensilsCrossed, Hotel, Landmark, Bath, ThumbsUp,
  AlertCircle, Info, HandMetal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

interface AccessibilityProfile {
  wheelchair: boolean;
  visualImpairment: boolean;
  hearingImpairment: boolean;
  seniorMode: boolean;
}

interface VisualSettings {
  highContrast: boolean;
  textSize: number;
  screenReaderOptimized: boolean;
  audioNavigation: boolean;
}

interface HearingSettings {
  visualNotifications: boolean;
  vibrationPatterns: boolean;
  captionDisplay: boolean;
  signLanguageGifs: boolean;
}

interface SeniorSettings {
  simplifiedUI: boolean;
  largerButtons: boolean;
  medicalConditions: string;
  medicationReminders: boolean;
  familyShareMode: boolean;
}

interface RoutingSettings {
  accessibleRoutes: boolean;
  avoidStairs: boolean;
  avoidSteepInclines: boolean;
  preferElevators: boolean;
}

interface AccessiblePOI {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'attraction' | 'restroom';
  distance: string;
  rating: number;
  accessibilityScore: number;
  features: string[];
  address: string;
}

interface CommunityRating {
  id: string;
  location: string;
  author: string;
  date: string;
  overallScore: number;
  wheelchairAccess: number;
  visualAids: number;
  hearingAids: number;
  staffHelpfulness: number;
  comment: string;
}

interface SignLanguagePhrase {
  id: string;
  phrase: string;
  category: string;
  description: string;
}

/* ──────────────── Mock Data ──────────────── */

const mockPOIs: AccessiblePOI[] = [
  { id: '1', name: 'Green Garden Restaurant', type: 'restaurant', distance: '0.3 km', rating: 4.5, accessibilityScore: 95, features: ['Wheelchair ramp', 'Braille menu', 'Accessible restroom', 'Ground floor'], address: '12 MG Road, Bangalore' },
  { id: '2', name: 'Comfort Inn Accessible', type: 'hotel', distance: '1.2 km', rating: 4.7, accessibilityScore: 98, features: ['Roll-in shower', 'Grab bars', 'Visual fire alarms', 'Lowered reception desk', 'Accessible pool'], address: '45 Brigade Road, Bangalore' },
  { id: '3', name: 'Heritage Museum', type: 'attraction', distance: '2.1 km', rating: 4.3, accessibilityScore: 85, features: ['Wheelchair accessible', 'Audio guides', 'Tactile exhibits', 'Elevator access'], address: '78 Cubbon Park, Bangalore' },
  { id: '4', name: 'City Mall Restroom', type: 'restroom', distance: '0.5 km', rating: 4.0, accessibilityScore: 90, features: ['Wheelchair accessible', 'Grab rails', 'Emergency pull cord', 'Auto door'], address: 'Forum Mall, Level 1, Bangalore' },
  { id: '5', name: 'Spice Route Restaurant', type: 'restaurant', distance: '0.8 km', rating: 4.2, accessibilityScore: 80, features: ['Wheelchair ramp', 'Accessible restroom', 'Staff assistance'], address: '23 Church Street, Bangalore' },
  { id: '6', name: 'The Grand Palace Hotel', type: 'hotel', distance: '3.5 km', rating: 4.8, accessibilityScore: 92, features: ['Accessible rooms', 'Visual doorbell', 'Roll-in shower', 'Lowered switches'], address: '1 Palace Road, Bangalore' },
  { id: '7', name: 'Botanical Gardens', type: 'attraction', distance: '4.0 km', rating: 4.6, accessibilityScore: 75, features: ['Paved paths', 'Wheelchair accessible', 'Rest areas', 'Accessible parking'], address: 'Lalbagh, Bangalore' },
  { id: '8', name: 'Central Station Restroom', type: 'restroom', distance: '1.8 km', rating: 3.8, accessibilityScore: 82, features: ['Wheelchair accessible', 'Grab rails', 'Wide doorway'], address: 'Majestic Station, Platform 1, Bangalore' },
];

const mockCommunityRatings: CommunityRating[] = [
  { id: '1', location: 'Bangalore Metro System', author: 'WheelchairTraveler', date: '2026-03-05', overallScore: 4.2, wheelchairAccess: 4.5, visualAids: 3.8, hearingAids: 4.0, staffHelpfulness: 4.5, comment: 'Great elevator access at most stations. Tactile flooring throughout. Staff very helpful with ramp deployment.' },
  { id: '2', location: 'Mysore Palace', author: 'SeniorExplorer', date: '2026-02-28', overallScore: 3.5, wheelchairAccess: 3.0, visualAids: 3.5, hearingAids: 3.0, staffHelpfulness: 4.5, comment: 'Historic building has limitations but staff goes above and beyond. Audio guide available. Some areas not wheelchair accessible.' },
  { id: '3', location: 'Chennai Airport T2', author: 'VisuallyImpaired_Raj', date: '2026-03-10', overallScore: 4.7, wheelchairAccess: 4.8, visualAids: 4.5, hearingAids: 4.8, staffHelpfulness: 4.8, comment: 'Excellent tactile paths, audible announcements in multiple languages, dedicated assistance staff. Top-notch accessible restrooms.' },
  { id: '4', location: 'Goa Beach Resorts Area', author: 'FamilyCaregiver', date: '2026-03-01', overallScore: 2.8, wheelchairAccess: 2.0, visualAids: 2.5, hearingAids: 3.0, staffHelpfulness: 3.5, comment: 'Beach accessibility is poor - no beach wheelchairs available. Hotels are okay but sand makes movement difficult. Need improvement.' },
  { id: '5', location: 'Delhi Metro', author: 'HearingImpaired_Sam', date: '2026-03-08', overallScore: 4.4, wheelchairAccess: 4.5, visualAids: 4.2, hearingAids: 4.5, staffHelpfulness: 4.3, comment: 'LED displays at every station with real-time info. Visual announcements are clear. Sign language assistance available at major stations.' },
];

const signLanguagePhrases: SignLanguagePhrase[] = [
  { id: '1', phrase: 'Hello / Namaste', category: 'Greetings', description: 'Both palms together at chest level, slight bow' },
  { id: '2', phrase: 'Thank you', category: 'Greetings', description: 'Flat hand from chin, moving forward and down' },
  { id: '3', phrase: 'Help me please', category: 'Emergency', description: 'Fist on open palm, lift upward together' },
  { id: '4', phrase: 'Where is the restroom?', category: 'Navigation', description: 'Letter T hand, shake side to side' },
  { id: '5', phrase: 'I need a doctor', category: 'Emergency', description: 'Tap wrist with opposite fingers, then point outward' },
  { id: '6', phrase: 'How much does this cost?', category: 'Shopping', description: 'Tap fingertips together twice (money sign), then questioning face' },
  { id: '7', phrase: 'I am lost', category: 'Navigation', description: 'Open hands facing in, twist to face out with confused expression' },
  { id: '8', phrase: 'Please speak slowly', category: 'Communication', description: 'Flat hand near mouth, slow forward movement, then slow palm-down gesture' },
  { id: '9', phrase: 'I don\'t understand', category: 'Communication', description: 'Index finger touching forehead, then flicking outward' },
  { id: '10', phrase: 'Water', category: 'Essentials', description: 'W-hand tapping chin twice' },
];

const poiTypeIcons: Record<string, React.ElementType> = {
  restaurant: UtensilsCrossed,
  hotel: Hotel,
  attraction: Landmark,
  restroom: Bath,
};

const poiTypeLabels: Record<string, string> = {
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  attraction: 'Attraction',
  restroom: 'Restroom',
};

const poiTypeColors: Record<string, string> = {
  restaurant: 'bg-orange-50 border-orange-200 text-orange-700',
  hotel: 'bg-blue-50 border-blue-200 text-blue-700',
  attraction: 'bg-purple-50 border-purple-200 text-purple-700',
  restroom: 'bg-teal-50 border-teal-200 text-teal-700',
};

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/* ──────────────── Component ──────────────── */

export default function AccessibilityPage() {
  // Profile
  const [profile, setProfile] = useState<AccessibilityProfile>({
    wheelchair: false,
    visualImpairment: false,
    hearingImpairment: false,
    seniorMode: false,
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Visual
  const [visual, setVisual] = useState<VisualSettings>({
    highContrast: false,
    textSize: 16,
    screenReaderOptimized: false,
    audioNavigation: false,
  });

  // Hearing
  const [hearing, setHearing] = useState<HearingSettings>({
    visualNotifications: false,
    vibrationPatterns: false,
    captionDisplay: false,
    signLanguageGifs: false,
  });

  // Senior
  const [senior, setSenior] = useState<SeniorSettings>({
    simplifiedUI: false,
    largerButtons: false,
    medicalConditions: '',
    medicationReminders: false,
    familyShareMode: false,
  });

  // Routing
  const [routing, setRouting] = useState<RoutingSettings>({
    accessibleRoutes: false,
    avoidStairs: false,
    avoidSteepInclines: false,
    preferElevators: false,
  });

  // POI filter
  const [poiFilter, setPoiFilter] = useState<string>('all');
  const [poiSearch, setPoiSearch] = useState('');

  // Community ratings
  const [expandedRating, setExpandedRating] = useState<string | null>(null);

  // Sign language category
  const [signCategory, setSignCategory] = useState('All');

  // Loading simulation
  const [isLoading, setIsLoading] = useState(false);

  const toggleProfile = (key: keyof AccessibilityProfile) => {
    setProfile((prev) => ({ ...prev, [key]: !prev[key] }));
    setProfileSaved(false);
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProfileSaved(true);
      setIsLoading(false);
      setTimeout(() => setProfileSaved(false), 3000);
    }, 800);
  };

  const filteredPOIs = useMemo(() => {
    let results = mockPOIs;
    if (poiFilter !== 'all') {
      results = results.filter((p) => p.type === poiFilter);
    }
    if (poiSearch) {
      const q = poiSearch.toLowerCase();
      results = results.filter(
        (p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
      );
    }
    return results;
  }, [poiFilter, poiSearch]);

  const signCategories = useMemo(() => {
    const cats = new Set(signLanguagePhrases.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredPhrases = useMemo(() => {
    if (signCategory === 'All') return signLanguagePhrases;
    return signLanguagePhrases.filter((p) => p.category === signCategory);
  }, [signCategory]);

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalf = score - fullStars >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < fullStars
                ? 'text-amber-400 fill-amber-400'
                : i === fullStars && hasHalf
                  ? 'text-amber-400 fill-amber-400/50'
                  : 'text-gray-200'
            )}
          />
        ))}
        <span className="text-xs font-semibold text-gray-600 ml-1">{score.toFixed(1)}</span>
      </div>
    );
  };

  const renderAccessibilityBar = (score: number) => {
    const color = score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs font-bold text-gray-600">{score}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-3xl font-bold text-[#1A3C5E]">Accessible Travel Mode</h1>
        <p className="text-gray-500 mt-1">Personalize your travel experience for maximum comfort and accessibility</p>
      </motion.div>

      {/* ─── Accessibility Profile Setup ─── */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-[#E8733A]" />
              Accessibility Profile
            </CardTitle>
            <Button
              size="sm"
              onClick={handleSaveProfile}
              disabled={isLoading}
              className={cn(
                'gap-1.5 transition-all',
                profileSaved
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-[#E8733A] hover:bg-[#d4642e]'
              )}
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : profileSaved ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {isLoading ? 'Saving...' : profileSaved ? 'Saved!' : 'Save Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'wheelchair' as const, label: 'Wheelchair User', icon: Accessibility, description: 'Enable wheelchair-accessible routing and POI filtering', color: 'bg-blue-50 border-blue-200' },
                { key: 'visualImpairment' as const, label: 'Visual Impairment', icon: Eye, description: 'Enhanced visual aids, screen reader optimization, and audio cues', color: 'bg-purple-50 border-purple-200' },
                { key: 'hearingImpairment' as const, label: 'Hearing Impairment', icon: Ear, description: 'Visual alerts, captions, vibration patterns, and sign language support', color: 'bg-teal-50 border-teal-200' },
                { key: 'seniorMode' as const, label: 'Senior Traveler', icon: Heart, description: 'Simplified interface, larger controls, medication reminders', color: 'bg-rose-50 border-rose-200' },
              ].map((item, index) => {
                const Icon = item.icon;
                const enabled = profile[item.key];
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border transition-all',
                      enabled ? item.color : 'bg-gray-50 border-gray-100'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                        enabled ? 'bg-white/80' : 'bg-white'
                      )}>
                        <Icon className={cn('w-5 h-5', enabled ? 'text-[#E8733A]' : 'text-gray-400')} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1A3C5E]">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={() => toggleProfile(item.key)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Main Tabs ─── */}
      <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
        <Tabs defaultValue="routing" className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto gap-1 p-1">
            <TabsTrigger value="routing" className="gap-1.5 text-xs sm:text-sm py-2">
              <Navigation className="w-3.5 h-3.5" />
              Routing
            </TabsTrigger>
            <TabsTrigger value="visual" className="gap-1.5 text-xs sm:text-sm py-2">
              <Eye className="w-3.5 h-3.5" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="hearing" className="gap-1.5 text-xs sm:text-sm py-2">
              <Ear className="w-3.5 h-3.5" />
              Hearing
            </TabsTrigger>
            <TabsTrigger value="senior" className="gap-1.5 text-xs sm:text-sm py-2">
              <Heart className="w-3.5 h-3.5" />
              Senior
            </TabsTrigger>
          </TabsList>

          {/* ── Wheelchair-Accessible Routing ── */}
          <TabsContent value="routing">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#E8733A]" />
                  Wheelchair-Accessible Routing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn(
                  'p-4 rounded-xl border transition-all',
                  routing.accessibleRoutes ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Accessibility className={cn('w-5 h-5 mt-0.5', routing.accessibleRoutes ? 'text-blue-600' : 'text-gray-400')} />
                      <div>
                        <p className="text-sm font-semibold text-[#1A3C5E]">Enable Accessible Routes</p>
                        <p className="text-xs text-gray-500 mt-0.5">All routes will prioritize wheelchair-accessible paths</p>
                      </div>
                    </div>
                    <Switch
                      checked={routing.accessibleRoutes}
                      onCheckedChange={(v) => setRouting((prev) => ({ ...prev, accessibleRoutes: v }))}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {routing.accessibleRoutes && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      {[
                        { key: 'avoidStairs' as const, label: 'Avoid Stairs', description: 'Route around all staircases, prefer ramps and elevators' },
                        { key: 'avoidSteepInclines' as const, label: 'Avoid Steep Inclines', description: 'Avoid routes with inclines greater than 8% grade' },
                        { key: 'preferElevators' as const, label: 'Prefer Elevators', description: 'Always route through elevator access points when available' },
                      ].map((opt) => (
                        <div key={opt.key} className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-[#1A3C5E]">{opt.label}</p>
                            <p className="text-xs text-gray-500">{opt.description}</p>
                          </div>
                          <Switch
                            checked={routing[opt.key]}
                            onCheckedChange={(v) => setRouting((prev) => ({ ...prev, [opt.key]: v }))}
                          />
                        </div>
                      ))}

                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Route Information</p>
                            <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                              Accessible routes may be slightly longer but avoid stairs, steep inclines, and narrow passages.
                              Routes are verified by our community of wheelchair users and updated regularly.
                              Surface type information (paved, gravel, cobblestone) is included in route details.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Visual Accessibility ── */}
          <TabsContent value="visual">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#E8733A]" />
                  Visual Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* High Contrast */}
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  visual.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-start gap-3">
                    <Contrast className={cn('w-5 h-5 mt-0.5', visual.highContrast ? 'text-yellow-400' : 'text-gray-400')} />
                    <div>
                      <p className={cn('text-sm font-semibold', visual.highContrast ? 'text-white' : 'text-[#1A3C5E]')}>High Contrast Mode</p>
                      <p className={cn('text-xs mt-0.5', visual.highContrast ? 'text-gray-300' : 'text-gray-500')}>
                        Increases contrast between foreground and background elements
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={visual.highContrast}
                    onCheckedChange={(v) => setVisual((prev) => ({ ...prev, highContrast: v }))}
                  />
                </div>

                {/* Text Size Slider */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-5 h-5 text-gray-400" />
                      <p className="text-sm font-semibold text-[#1A3C5E]">Dynamic Text Size</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{visual.textSize}px</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">A</span>
                    <input
                      type="range"
                      min={12}
                      max={28}
                      step={1}
                      value={visual.textSize}
                      onChange={(e) => setVisual((prev) => ({ ...prev, textSize: Number(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8733A]"
                    />
                    <span className="text-lg font-bold text-gray-400">A</span>
                  </div>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100">
                    <p style={{ fontSize: `${visual.textSize}px` }} className="text-[#1A3C5E] leading-relaxed">
                      Preview: This is how your text will appear throughout the app.
                    </p>
                  </div>
                </div>

                {/* Screen Reader */}
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  visual.screenReaderOptimized ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-start gap-3">
                    <MonitorSmartphone className={cn('w-5 h-5 mt-0.5', visual.screenReaderOptimized ? 'text-purple-600' : 'text-gray-400')} />
                    <div>
                      <p className="text-sm font-semibold text-[#1A3C5E]">Screen Reader Support</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Optimizes all content with ARIA labels, semantic structure, and focus management for screen readers
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={visual.screenReaderOptimized}
                    onCheckedChange={(v) => setVisual((prev) => ({ ...prev, screenReaderOptimized: v }))}
                  />
                </div>

                {/* Audio Navigation */}
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  visual.audioNavigation ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-start gap-3">
                    <Volume2 className={cn('w-5 h-5 mt-0.5', visual.audioNavigation ? 'text-green-600' : 'text-gray-400')} />
                    <div>
                      <p className="text-sm font-semibold text-[#1A3C5E]">Audio Navigation</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Turn-by-turn voice guidance with haptic feedback at decision points, distance callouts, and landmark descriptions
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={visual.audioNavigation}
                    onCheckedChange={(v) => setVisual((prev) => ({ ...prev, audioNavigation: v }))}
                  />
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-purple-700 leading-relaxed">
                      Screen reader support works with VoiceOver (iOS), TalkBack (Android), and NVDA/JAWS (desktop).
                      All images include descriptive alt text. Interactive elements are properly labeled with ARIA roles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Hearing Accessibility ── */}
          <TabsContent value="hearing">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ear className="w-5 h-5 text-[#E8733A]" />
                    Hearing Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'visualNotifications' as const, label: 'Visual Notifications', icon: AlertCircle, description: 'Replace all audio alerts with visual flash notifications and on-screen banners', color: 'bg-amber-50 border-amber-200' },
                    { key: 'vibrationPatterns' as const, label: 'Vibration Patterns', icon: Vibrate, description: 'Unique vibration patterns for different notification types (navigation, messages, alerts)', color: 'bg-indigo-50 border-indigo-200' },
                    { key: 'captionDisplay' as const, label: 'Caption Display', icon: Subtitles, description: 'Auto-generate live captions for audio guides, announcements, and video content', color: 'bg-cyan-50 border-cyan-200' },
                    { key: 'signLanguageGifs' as const, label: 'Sign Language Phrases', icon: HandMetal, description: 'Access a library of essential travel phrases in sign language with visual guides', color: 'bg-pink-50 border-pink-200' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    const enabled = hearing[item.key];
                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-xl border transition-all',
                          enabled ? item.color : 'bg-gray-50 border-gray-100'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={cn('w-5 h-5 mt-0.5', enabled ? 'text-[#E8733A]' : 'text-gray-400')} />
                          <div>
                            <p className="text-sm font-semibold text-[#1A3C5E]">{item.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(v) => setHearing((prev) => ({ ...prev, [item.key]: v }))}
                        />
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Sign Language Phrase Library */}
              <AnimatePresence>
                {hearing.signLanguageGifs && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <HandMetal className="w-5 h-5 text-pink-500" />
                          Sign Language Phrase Library
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                          {signCategories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSignCategory(cat)}
                              className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                                signCategory === cat
                                  ? 'bg-[#E8733A] text-white shadow-sm'
                                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredPhrases.map((phrase, i) => (
                            <motion.div
                              key={phrase.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="p-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shrink-0">
                                  <HandMetal className="w-6 h-6 text-pink-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#1A3C5E]">{phrase.phrase}</p>
                                  <Badge variant="outline" className="text-[10px] mt-1 mb-1.5">{phrase.category}</Badge>
                                  <p className="text-xs text-gray-500 leading-relaxed">{phrase.description}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* ── Senior Traveler Mode ── */}
          <TabsContent value="senior">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#E8733A]" />
                  Senior Traveler Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Simplified UI */}
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  senior.simplifiedUI ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-start gap-3">
                    <MonitorSmartphone className={cn('w-5 h-5 mt-0.5', senior.simplifiedUI ? 'text-rose-600' : 'text-gray-400')} />
                    <div>
                      <p className="text-sm font-semibold text-[#1A3C5E]">Simplified UI</p>
                      <p className="text-xs text-gray-500 mt-0.5">Reduce visual complexity, show only essential features and large clear buttons</p>
                    </div>
                  </div>
                  <Switch
                    checked={senior.simplifiedUI}
                    onCheckedChange={(v) => setSenior((prev) => ({ ...prev, simplifiedUI: v }))}
                  />
                </div>

                {/* Larger Buttons */}
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  senior.largerButtons ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-start gap-3">
                    <Shield className={cn('w-5 h-5 mt-0.5', senior.largerButtons ? 'text-orange-600' : 'text-gray-400')} />
                    <div>
                      <p className="text-sm font-semibold text-[#1A3C5E]">Larger Touch Targets</p>
                      <p className="text-xs text-gray-500 mt-0.5">Increase all button and interactive element sizes by 50% for easier tapping</p>
                    </div>
                  </div>
                  <Switch
                    checked={senior.largerButtons}
                    onCheckedChange={(v) => setSenior((prev) => ({ ...prev, largerButtons: v }))}
                  />
                </div>

                <Separator />

                {/* Medical Conditions */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <p className="text-sm font-semibold text-[#1A3C5E]">Medical Conditions</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Enter any medical conditions for emergency situations. This info is stored securely and shared only during SOS alerts.
                  </p>
                  <textarea
                    value={senior.medicalConditions}
                    onChange={(e) => setSenior((prev) => ({ ...prev, medicalConditions: e.target.value }))}
                    placeholder="e.g., Diabetes Type 2, High blood pressure, Pacemaker..."
                    className="w-full min-h-[80px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] resize-none"
                  />
                </div>

                {/* Medication Reminders */}
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  senior.medicationReminders ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-start gap-3">
                    <Pill className={cn('w-5 h-5 mt-0.5', senior.medicationReminders ? 'text-green-600' : 'text-gray-400')} />
                    <div>
                      <p className="text-sm font-semibold text-[#1A3C5E]">Medication Reminders</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Set reminders adjusted to your travel timezone. Notifications include local pharmacy finder.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={senior.medicationReminders}
                    onCheckedChange={(v) => setSenior((prev) => ({ ...prev, medicationReminders: v }))}
                  />
                </div>

                <AnimatePresence>
                  {senior.medicationReminders && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-green-50 border border-green-100"
                    >
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Timezone-Aware Reminders Active</p>
                          <p className="text-xs text-green-600 mt-1">
                            Medication reminders will automatically adjust to your destination timezone.
                            You can add specific medications and schedules in your health profile settings.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Family Share Mode */}
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-xl border transition-all',
                  senior.familyShareMode ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'
                )}>
                  <div className="flex items-start gap-3">
                    <Share2 className={cn('w-5 h-5 mt-0.5', senior.familyShareMode ? 'text-blue-600' : 'text-gray-400')} />
                    <div>
                      <p className="text-sm font-semibold text-[#1A3C5E]">Family Share Mode</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Share your live location, itinerary, and health status with family members for peace of mind
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={senior.familyShareMode}
                    onCheckedChange={(v) => setSenior((prev) => ({ ...prev, familyShareMode: v }))}
                  />
                </div>

                <AnimatePresence>
                  {senior.familyShareMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-blue-50 border border-blue-100"
                    >
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Family Sharing Active</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Family members can view your location and receive alerts.
                            Invite family members via the Partner app or share an invite link.
                          </p>
                          <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 gap-1.5 text-xs">
                            <Users className="w-3 h-3" />
                            Invite Family Member
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ─── Accessible POI Finder ─── */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E8733A]" />
              Accessible POI Finder
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search accessible places..."
                  value={poiSearch}
                  onChange={(e) => setPoiSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'restaurant', label: 'Restaurants' },
                  { key: 'hotel', label: 'Hotels' },
                  { key: 'attraction', label: 'Attractions' },
                  { key: 'restroom', label: 'Restrooms' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setPoiFilter(f.key)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                      poiFilter === f.key
                        ? 'bg-[#E8733A] text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* POI Grid */}
            {filteredPOIs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPOIs.map((poi, i) => {
                  const Icon = poiTypeIcons[poi.type];
                  return (
                    <motion.div
                      key={poi.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-all h-full overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-3">
                              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', poiTypeColors[poi.type])}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#1A3C5E]">{poi.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-[10px]">{poiTypeLabels[poi.type]}</Badge>
                                  <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                    <MapPin className="w-3 h-3" />
                                    {poi.distance}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mb-2">{poi.address}</p>

                          {/* Accessibility Score */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-500">Accessibility Score</span>
                            </div>
                            {renderAccessibilityBar(poi.accessibilityScore)}
                          </div>

                          {/* Rating */}
                          <div className="mb-3">
                            {renderStars(poi.rating)}
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1">
                            {poi.features.map((f) => (
                              <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                                {f}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No accessible places found matching your search</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Community Accessibility Ratings ─── */}
      <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E8733A]" />
              Community Accessibility Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCommunityRatings.map((rating, index) => (
              <motion.div
                key={rating.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setExpandedRating(expandedRating === rating.id ? null : rating.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-sm text-[#1A3C5E]">{rating.location}</h4>
                        <Badge
                          className={cn(
                            'text-[10px]',
                            rating.overallScore >= 4 ? 'bg-green-100 text-green-700' :
                            rating.overallScore >= 3 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          )}
                        >
                          {rating.overallScore >= 4 ? 'Highly Accessible' : rating.overallScore >= 3 ? 'Moderately Accessible' : 'Needs Improvement'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>by {rating.author}</span>
                        <span>{new Date(rating.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="mt-1.5">
                        {renderStars(rating.overallScore)}
                      </div>
                    </div>
                    {expandedRating === rating.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedRating === rating.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <Separator />

                        {/* Detailed Scores */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Wheelchair Access', score: rating.wheelchairAccess, icon: Accessibility },
                            { label: 'Visual Aids', score: rating.visualAids, icon: Eye },
                            { label: 'Hearing Aids', score: rating.hearingAids, icon: Ear },
                            { label: 'Staff Helpfulness', score: rating.staffHelpfulness, icon: ThumbsUp },
                          ].map((item) => {
                            const ScoreIcon = item.icon;
                            return (
                              <div key={item.label} className="p-3 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <ScoreIcon className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                                </div>
                                {renderAccessibilityBar(item.score * 20)}
                              </div>
                            );
                          })}
                        </div>

                        {/* Comment */}
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-sm text-gray-700 leading-relaxed">{rating.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
