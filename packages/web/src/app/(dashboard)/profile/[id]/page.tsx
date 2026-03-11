'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Trophy, Shield, Calendar, Route,
  Send, ChevronRight, Award, Compass, Mountain, Flame,
  Globe, Camera, Footprints, Tent, Map,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const mockUser = {
  id: 'usr_28391',
  name: 'Kavya Sharma',
  level: 14,
  levelTitle: 'Trailblazer',
  verificationTier: 'Gold',
  bio: 'Mountain lover, street food hunter, and sunrise chaser. I believe every journey starts with a single step (and a good cup of chai). Based in Pune, exploring the Sahyadris on weekends.',
  avatar: 'KS',
  stats: {
    totalKm: 18420,
    places: 94,
    trips: 23,
    rating: 4.8,
  },
};

const mockBadges = [
  { id: 1, name: 'Sahyadri Explorer', icon: Mountain, color: 'text-green-600', bg: 'bg-green-100', earned: '2025-06-15' },
  { id: 2, name: 'Night Owl', icon: Compass, color: 'text-purple-600', bg: 'bg-purple-100', earned: '2025-08-22' },
  { id: 3, name: 'Foodie Trail', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100', earned: '2025-09-10' },
  { id: 4, name: 'Solo Warrior', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100', earned: '2025-11-05' },
  { id: 5, name: 'Heritage Keeper', icon: Award, color: 'text-amber-600', bg: 'bg-amber-100', earned: '2025-12-20' },
  { id: 6, name: '10K Club', icon: Route, color: 'text-red-600', bg: 'bg-red-100', earned: '2026-01-08' },
  { id: 7, name: 'Globe Trotter', icon: Globe, color: 'text-cyan-600', bg: 'bg-cyan-100', earned: '2026-01-30' },
  { id: 8, name: 'Shutter Bug', icon: Camera, color: 'text-pink-600', bg: 'bg-pink-100', earned: '2026-02-14' },
  { id: 9, name: 'Trekker Elite', icon: Footprints, color: 'text-emerald-600', bg: 'bg-emerald-100', earned: '2026-02-28' },
  { id: 10, name: 'Camp Master', icon: Tent, color: 'text-yellow-600', bg: 'bg-yellow-100', earned: '2026-03-01' },
  { id: 11, name: 'Route Mapper', icon: Map, color: 'text-indigo-600', bg: 'bg-indigo-100', earned: '2026-03-05' },
  { id: 12, name: 'Streak 30', icon: Flame, color: 'text-rose-600', bg: 'bg-rose-100', earned: '2026-03-08' },
];

const mockTrips = [
  { id: 1, name: 'Ladakh Road Trip', date: 'Jan 2026', duration: '12 days', distance: '2,400 km', mode: 'Car' },
  { id: 2, name: 'Hampi Heritage Walk', date: 'Dec 2025', duration: '4 days', distance: '85 km', mode: 'Trek' },
  { id: 3, name: 'Goa Beach Hop', date: 'Nov 2025', duration: '5 days', distance: '320 km', mode: 'Bike' },
  { id: 4, name: 'Coorg Coffee Trail', date: 'Oct 2025', duration: '3 days', distance: '180 km', mode: 'Car' },
  { id: 5, name: 'Spiti Valley Circuit', date: 'Aug 2025', duration: '10 days', distance: '1,800 km', mode: 'Bike' },
];

const mockReviews = [
  { id: 1, reviewer: 'Rohan K.', avatar: 'RK', rating: 5, comment: 'Kavya is an amazing travel partner! She planned the entire Ladakh trip flawlessly. Great navigator, always positive, and her chai-making skills at 14,000 ft are legendary.', date: 'Jan 2026' },
  { id: 2, reviewer: 'Meera P.', avatar: 'MP', rating: 5, comment: 'Traveled with Kavya to Hampi. She knows so much about history and architecture. Made the trip educational and fun. Highly recommend!', date: 'Dec 2025' },
  { id: 3, reviewer: 'Arjun M.', avatar: 'AM', rating: 4, comment: 'Great company on the Goa trip. Kavya found the best hidden beaches and local restaurants. Only downside: she wakes up too early for sunrise shots!', date: 'Nov 2025' },
];

const verificationColors: Record<string, string> = {
  Gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Silver: 'bg-gray-100 text-gray-700 border-gray-300',
  Platinum: 'bg-violet-100 text-violet-700 border-violet-300',
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(s, i <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : i - 0.5 <= rating ? 'fill-yellow-400/50 text-yellow-400' : 'text-gray-300')} />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner & Avatar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
        <div className="h-48 rounded-2xl bg-gradient-to-r from-[#1A3C5E] via-[#2d5a8a] to-[#E8733A] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-10 -right-10" />
            <div className="absolute w-60 h-60 rounded-full bg-white/5 -bottom-20 -left-20" />
          </div>
        </div>
        <div className="absolute -bottom-12 left-6 sm:left-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E8733A] to-[#d4642e] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
            {mockUser.avatar}
          </div>
        </div>
      </motion.div>

      {/* Name & Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="pt-8 px-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-[#1A3C5E]">{mockUser.name}</h1>
              <Badge className="bg-[#1A3C5E] text-white text-xs">Lv.{mockUser.level} {mockUser.levelTitle}</Badge>
              <Badge className={cn('text-xs border', verificationColors[mockUser.verificationTier])}>
                <Shield className="w-3 h-3 mr-1" /> {mockUser.verificationTier} Verified
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2 max-w-lg">{mockUser.bio}</p>
          </div>
          <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2 shrink-0">
            <Send className="w-4 h-4" /> Send Trip Invite
          </Button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total KM', value: mockUser.stats.totalKm.toLocaleString(), icon: Route, color: 'text-blue-500' },
          { label: 'Places', value: mockUser.stats.places.toString(), icon: MapPin, color: 'text-green-500' },
          { label: 'Trips', value: mockUser.stats.trips.toString(), icon: Compass, color: 'text-purple-500' },
          { label: 'Rating', value: mockUser.stats.rating.toString(), icon: Star, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <Card key={i} className="text-center">
            <CardContent className="py-4">
              <stat.icon className={cn('w-5 h-5 mx-auto mb-1', stat.color)} />
              <p className="text-xl font-bold text-[#1A3C5E]">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Badge Wall */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#E8733A]" /> Badge Wall
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {mockBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.03 * i }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
            >
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="py-3 px-2">
                  <div className={cn('w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-1.5', badge.bg)}>
                    <badge.icon className={cn('w-5 h-5', badge.color)} />
                  </div>
                  <p className="text-xs font-medium text-[#1A3C5E] leading-tight">{badge.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trip History */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#E8733A]" /> Trip History
        </h2>
        <div className="space-y-2">
          {mockTrips.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center shrink-0">
                        <Route className="w-5 h-5 text-[#1A3C5E]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1A3C5E] text-sm">{trip.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{trip.date}</span>
                          <span>&middot;</span>
                          <span>{trip.duration}</span>
                          <span>&middot;</span>
                          <span>{trip.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{trip.mode}</Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Reviews */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-[#E8733A]" /> Reviews
        </h2>
        <div className="space-y-3">
          {mockReviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#1A3C5E] text-sm">{review.reviewer}</p>
                          <StarRating rating={review.rating} />
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
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
