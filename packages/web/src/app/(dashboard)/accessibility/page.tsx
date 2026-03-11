'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accessibility, Eye, Ear, Heart, MapPin, Route, Star,
  Save, Navigation, Search, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const accessiblePOIs = [
  { id: 1, name: 'India Gate & Rajpath', location: 'New Delhi', badges: ['Wheelchair', 'Accessible Restroom'], rating: 85, description: 'Flat terrain, wide pathways. Ramps available at both entries.' },
  { id: 2, name: 'Gateway of India', location: 'Mumbai', badges: ['Wheelchair', 'Hearing Loop', 'Accessible Restroom'], rating: 78, description: 'Ground-level access, audio guides available, accessible restrooms nearby.' },
  { id: 3, name: 'Mysore Palace', location: 'Mysore', badges: ['Wheelchair', 'Braille', 'Accessible Restroom'], rating: 72, description: 'Wheelchair ramps installed. Braille guides available at ticket counter.' },
  { id: 4, name: 'Hawa Mahal', location: 'Jaipur', badges: ['Braille'], rating: 45, description: 'Limited wheelchair access due to narrow staircases. Ground floor accessible.' },
  { id: 5, name: 'Marine Drive Promenade', location: 'Mumbai', badges: ['Wheelchair', 'Accessible Restroom'], rating: 90, description: 'Flat, wide promenade. Fully wheelchair accessible. Multiple rest areas.' },
];

const badgeConfig: Record<string, { emoji: string; color: string }> = {
  Wheelchair: { emoji: '♿', color: 'bg-blue-100 text-blue-700' },
  Braille: { emoji: '🔤', color: 'bg-purple-100 text-purple-700' },
  'Hearing Loop': { emoji: '🔊', color: 'bg-green-100 text-green-700' },
  'Accessible Restroom': { emoji: '🚻', color: 'bg-amber-100 text-amber-700' },
};

const seniorTips = [
  { id: 1, title: 'Book Aisle Seats on Flights', description: 'Request aisle seats for easier movement. Most airlines accommodate seniors on request. Pre-book wheelchair assistance at airports for long walks between gates.' },
  { id: 2, title: 'Choose Ground-Floor Accommodation', description: 'When booking hotels or homestays, request ground-floor rooms. Many heritage properties in India lack elevators.' },
  { id: 3, title: 'Carry a Medical Summary', description: 'Keep a laminated card with your medical conditions, medications, allergies, blood type, and emergency contacts in the local language.' },
  { id: 4, title: 'Plan for Rest Days', description: 'Build buffer days into your itinerary. Avoid back-to-back intensive sightseeing. A 3:1 ratio of activity to rest works well for multi-week trips.' },
  { id: 5, title: 'Use Authorized Tour Operators', description: 'For adventure activities like boat rides or nature walks, use operators registered with the Ministry of Tourism who carry proper safety equipment.' },
  { id: 6, title: 'Stay Hydrated & Carry Snacks', description: 'Dehydration is common in Indian summers. Carry a refillable bottle, ORS packets, and light snacks like dry fruits and biscuits.' },
];

export default function AccessibilityPage() {
  const [profile, setProfile] = useState({
    wheelchair: false,
    visual: false,
    hearing: false,
    senior: false,
    medical: '',
  });
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [routeResult, setRouteResult] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFindRoute = () => {
    if (routeFrom && routeTo) setRouteResult(true);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Accessible Travel</h1>
        <p className="text-gray-500 text-sm">Personalized accessibility features and accessible destinations</p>
      </motion.div>

      {/* Accessibility Profile */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-[#E8733A]" /> Accessibility Profile
        </h2>
        <Card>
          <CardContent className="pt-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">♿</span>
                  <p className="font-medium text-[#1A3C5E] text-sm">Wheelchair User</p>
                </div>
                <p className="text-xs text-gray-500 ml-7">Enable wheelchair-accessible routing and POI filtering</p>
              </div>
              <Switch checked={profile.wheelchair} onCheckedChange={(v) => setProfile({ ...profile, wheelchair: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#1A3C5E]" />
                  <p className="font-medium text-[#1A3C5E] text-sm">Visual Impairment</p>
                </div>
                <p className="text-xs text-gray-500 ml-7">Enable screen reader optimization and audio navigation</p>
              </div>
              <Switch checked={profile.visual} onCheckedChange={(v) => setProfile({ ...profile, visual: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Ear className="w-5 h-5 text-[#1A3C5E]" />
                  <p className="font-medium text-[#1A3C5E] text-sm">Hearing Impairment</p>
                </div>
                <p className="text-xs text-gray-500 ml-7">Enable visual alerts and caption display</p>
              </div>
              <Switch checked={profile.hearing} onCheckedChange={(v) => setProfile({ ...profile, hearing: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#1A3C5E]" />
                  <p className="font-medium text-[#1A3C5E] text-sm">Senior Mode</p>
                </div>
                <p className="text-xs text-gray-500 ml-7">Simplified UI with larger buttons and text</p>
              </div>
              <Switch checked={profile.senior} onCheckedChange={(v) => setProfile({ ...profile, senior: v })} />
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-[#1A3C5E] block mb-2">Medical Conditions</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] focus:ring-2 focus:ring-[#1A3C5E]/20 focus:border-[#1A3C5E] resize-none"
                placeholder="List any medical conditions, allergies, or special requirements..."
                value={profile.medical}
                onChange={(e) => setProfile({ ...profile, medical: e.target.value })}
              />
            </div>
            <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2" onClick={handleSaveProfile}>
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>
      </motion.section>

      {/* Wheelchair Route Planner */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Route className="w-5 h-5 text-[#E8733A]" /> Wheelchair Route Planner
        </h2>
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">From</label>
                <Input placeholder="Starting point" value={routeFrom} onChange={(e) => setRouteFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">To</label>
                <Input placeholder="Destination" value={routeTo} onChange={(e) => setRouteTo(e.target.value)} />
              </div>
            </div>
            <Button className="bg-[#1A3C5E] hover:bg-[#15334f] gap-2" onClick={handleFindRoute}>
              <Navigation className="w-4 h-4" /> Find Accessible Route
            </Button>
            {routeResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Accessibility className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">Accessible route found!</p>
                        <div className="mt-2 space-y-1 text-sm text-green-700">
                          <p>Distance: <span className="font-medium">2.3 km</span></p>
                          <p>Avoids: <span className="font-medium">3 stairways</span></p>
                          <p>Estimated time: <span className="font-medium">15 minutes</span></p>
                          <p>Ramps available: <span className="font-medium">4 ramp points along route</span></p>
                          <p>Accessible restrooms on route: <span className="font-medium">2</span></p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* Accessible POIs */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#E8733A]" /> Accessible POIs
        </h2>
        <div className="space-y-3">
          {accessiblePOIs.map((poi, i) => (
            <motion.div key={poi.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[#1A3C5E] text-sm">{poi.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{poi.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Accessibility</p>
                      <div className="flex items-center gap-1">
                        <div className="w-16">
                          <Progress value={poi.rating} className="h-1.5" />
                        </div>
                        <span className="text-xs font-medium text-[#1A3C5E]">{poi.rating}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {poi.badges.map((b) => (
                      <Badge key={b} className={cn('text-xs', badgeConfig[b]?.color || 'bg-gray-100 text-gray-700')}>
                        {badgeConfig[b]?.emoji} {b}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">{poi.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Senior Travel Tips */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#E8733A]" /> Senior Travel Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {seniorTips.map((tip, i) => (
            <motion.div key={tip.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
              <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-[#E8733A]/40">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8733A]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="w-4 h-4 text-[#E8733A]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3C5E] text-sm mb-1">{tip.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
