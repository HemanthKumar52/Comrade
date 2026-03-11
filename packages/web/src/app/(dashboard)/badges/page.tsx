'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeFamily = 'All' | 'Distance' | 'Place' | 'Vehicle' | 'Social' | 'Nature';

interface TravelBadge {
  id: string;
  name: string;
  family: Exclude<BadgeFamily, 'All'>;
  emoji: string;
  xp: number;
  unlocked: boolean;
  description: string;
}

const mockBadges: TravelBadge[] = [
  { id: '1', name: 'First Steps', family: 'Distance', emoji: '👣', xp: 10, unlocked: true, description: 'Travel your first 10 km' },
  { id: '2', name: 'Century Rider', family: 'Distance', emoji: '💯', xp: 25, unlocked: true, description: 'Complete 100 km total' },
  { id: '3', name: 'Road Warrior', family: 'Distance', emoji: '🛣️', xp: 50, unlocked: true, description: 'Travel 500 km in total' },
  { id: '4', name: 'Marathon Runner', family: 'Distance', emoji: '🏃', xp: 40, unlocked: false, description: 'Cover 1,000 km total' },
  { id: '5', name: 'Globe Trotter', family: 'Distance', emoji: '🌍', xp: 100, unlocked: false, description: 'Travel 5,000 km total' },
  { id: '6', name: 'Explorer', family: 'Place', emoji: '🗺️', xp: 15, unlocked: true, description: 'Visit your first destination' },
  { id: '7', name: 'City Hopper', family: 'Place', emoji: '🏙️', xp: 30, unlocked: true, description: 'Visit 5 different cities' },
  { id: '8', name: 'Temple Seeker', family: 'Place', emoji: '🛕', xp: 25, unlocked: true, description: 'Visit 3 heritage temples' },
  { id: '9', name: 'Beach Bum', family: 'Place', emoji: '🏖️', xp: 20, unlocked: false, description: 'Visit 5 beaches' },
  { id: '10', name: 'Heritage Hunter', family: 'Place', emoji: '🏛️', xp: 50, unlocked: false, description: 'Visit 10 UNESCO sites' },
  { id: '11', name: 'Biker Gang', family: 'Vehicle', emoji: '🏍️', xp: 20, unlocked: true, description: 'Complete 5 bike trips' },
  { id: '12', name: 'Road Tripper', family: 'Vehicle', emoji: '🚗', xp: 25, unlocked: true, description: 'Complete 5 car journeys' },
  { id: '13', name: 'Track Master', family: 'Vehicle', emoji: '🚂', xp: 30, unlocked: false, description: 'Take 10 train journeys' },
  { id: '14', name: 'Sky High', family: 'Vehicle', emoji: '✈️', xp: 40, unlocked: false, description: 'Take 5 flights' },
  { id: '15', name: 'Trek Legend', family: 'Vehicle', emoji: '🥾', xp: 35, unlocked: true, description: 'Complete 10 treks' },
  { id: '16', name: 'Social Butterfly', family: 'Social', emoji: '🦋', xp: 15, unlocked: true, description: 'Travel with 3 partners' },
  { id: '17', name: 'Group Leader', family: 'Social', emoji: '👥', xp: 30, unlocked: false, description: 'Lead a group trip of 5+' },
  { id: '18', name: 'Storyteller', family: 'Social', emoji: '📖', xp: 20, unlocked: true, description: 'Share 10 travel notes' },
  { id: '19', name: 'Helpful Hand', family: 'Social', emoji: '🤝', xp: 25, unlocked: false, description: 'Help 5 fellow travelers' },
  { id: '20', name: 'Community Star', family: 'Social', emoji: '⭐', xp: 50, unlocked: false, description: 'Get 50 likes on notes' },
  { id: '21', name: 'Sunrise Chaser', family: 'Nature', emoji: '🌅', xp: 15, unlocked: true, description: 'Watch 5 sunrises on trips' },
  { id: '22', name: 'Night Owl', family: 'Nature', emoji: '🦉', xp: 20, unlocked: false, description: 'Complete 3 night treks' },
  { id: '23', name: 'Mountain Goat', family: 'Nature', emoji: '🏔️', xp: 35, unlocked: false, description: 'Summit 5 peaks above 3000m' },
  { id: '24', name: 'Forest Dweller', family: 'Nature', emoji: '🌲', xp: 25, unlocked: false, description: 'Camp in 5 different forests' },
  { id: '25', name: 'Wild Camper', family: 'Nature', emoji: '⛺', xp: 30, unlocked: false, description: 'Camp under the stars 10 times' },
];

const families: BadgeFamily[] = ['All', 'Distance', 'Place', 'Vehicle', 'Social', 'Nature'];

const familyColors: Record<string, string> = {
  Distance: 'bg-blue-100 text-blue-700',
  Place: 'bg-green-100 text-green-700',
  Vehicle: 'bg-orange-100 text-orange-700',
  Social: 'bg-purple-100 text-purple-700',
  Nature: 'bg-emerald-100 text-emerald-700',
};

export default function BadgesPage() {
  const [activeFamily, setActiveFamily] = useState<BadgeFamily>('All');

  const filtered = activeFamily === 'All'
    ? mockBadges
    : mockBadges.filter((b) => b.family === activeFamily);

  const unlockedCount = mockBadges.filter((b) => b.unlocked).length;
  const totalXp = mockBadges.filter((b) => b.unlocked).reduce((sum, b) => sum + b.xp, 0);
  const currentLevel = 'Pathfinder';
  const nextLevelXp = 600;
  const levelProgress = (totalXp / nextLevelXp) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Badge Gallery</h1>
        <p className="text-gray-500 text-sm">Collect badges as you explore the world</p>
      </motion.div>

      {/* Level Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-r from-[#1A3C5E] to-[#2a5a8a] text-white border-0 overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center border-2 border-amber-400/50">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="text-xl font-bold">{currentLevel}</h3>
                    <p className="text-xs text-white/50">Level 4</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#E8733A]">{totalXp}</p>
                    <p className="text-xs text-white/50">/ {nextLevelXp} XP</p>
                  </div>
                </div>
                <div className="h-3 bg-white/15 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#E8733A] to-amber-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Family Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {families.map((family) => (
          <button
            key={family}
            onClick={() => setActiveFamily(family)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              activeFamily === family
                ? 'bg-[#1A3C5E] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            )}
          >
            {family}
          </button>
        ))}
      </motion.div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                'relative overflow-hidden transition-all hover:shadow-lg cursor-pointer group h-full',
                !badge.unlocked && 'opacity-55'
              )}
            >
              <CardContent className="p-5 text-center">
                {/* Lock overlay on hover */}
                {!badge.unlocked && (
                  <div className="absolute inset-0 bg-gray-200/40 backdrop-blur-[1px] flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white rounded-full p-2.5 shadow-lg">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Emoji */}
                <div className={cn('text-4xl mb-3 transition-all', !badge.unlocked && 'grayscale')}>
                  {badge.emoji}
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm text-[#1A3C5E] mb-1.5">{badge.name}</h3>

                {/* Family label */}
                <Badge className={cn('text-[10px] mb-2 font-medium', familyColors[badge.family])}>
                  {badge.family}
                </Badge>

                {/* Description */}
                <p className="text-[11px] text-gray-400 mb-2.5 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>

                {/* XP */}
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#E8733A]" />
                  <span className="text-xs font-bold text-[#E8733A]">{badge.xp} XP</span>
                </div>

                {/* Unlocked checkmark */}
                {badge.unlocked && (
                  <div className="absolute top-2.5 right-2.5">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center py-6"
      >
        <Card className="inline-block">
          <CardContent className="px-8 py-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-[#1A3C5E] text-lg">{unlockedCount}/{mockBadges.length}</span>{' '}
              Badges Unlocked
              <span className="mx-3 text-gray-300">|</span>
              <span className="font-bold text-[#E8733A] text-lg">{totalXp} XP</span>{' '}
              Total Earned
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
