'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Route, Trophy, Flame, Plus, Users, Radio, Map,
  Car, Bike, Bus, Train, Plane, Footprints,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { useTrips } from '@/hooks/useTrips';
import { useBadges } from '@/hooks/useBadges';
import { cn } from '@/lib/utils';

const vehicleIcons: Record<string, React.ElementType> = {
  car: Car, bike: Bike, bus: Bus, train: Train, flight: Plane, trek: Footprints,
};

interface StatRing {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
}

function StatRingCard({ stat }: { stat: StatRing }) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6 pb-4">
        <div className="w-16 h-16 rounded-full border-4 mx-auto flex items-center justify-center mb-3"
          style={{ borderColor: stat.color }}>
          <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
        </div>
        <p className="text-2xl font-bold text-[#1A3C5E]">
          {stat.value.toLocaleString()}{stat.unit}
        </p>
        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { trips, isLoading: tripsLoading } = useTrips();
  const { badges, userLevel, xp, nextLevelXp, isLoading: badgesLoading } = useBadges();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = loading || tripsLoading || badgesLoading;

  const statRings: StatRing[] = [
    { label: 'Total KM', value: 2450, unit: ' km', icon: Route, color: '#E8733A' },
    { label: 'Places Visited', value: 34, unit: '', icon: MapPin, color: '#3B82F6' },
    { label: 'Trips Completed', value: 18, unit: '', icon: Trophy, color: '#10B981' },
    { label: 'Travel Streak', value: 7, unit: ' days', icon: Flame, color: '#F59E0B' },
  ];

  const quickActions = [
    { label: 'Plan Trip', icon: Plus, href: '/trips/new', color: 'bg-[#E8733A]' },
    { label: 'Find Partner', icon: Users, href: '/partners', color: 'bg-blue-500' },
    { label: 'Start Recording', icon: Radio, href: '/map', color: 'bg-green-500' },
    { label: 'Open Map', icon: Map, href: '/map', color: 'bg-purple-500' },
  ];

  const recentTrips = trips?.slice(0, 5) || [];
  const recentBadges = badges?.filter((b: any) => b.unlockedAt).slice(0, 6) || [];
  const levelProgress = nextLevelXp ? ((xp || 0) / nextLevelXp) * 100 : 0;

  const vehicleBreakdown = [
    { type: 'Car', pct: 40, color: '#E8733A' },
    { type: 'Bike', pct: 25, color: '#3B82F6' },
    { type: 'Train', pct: 20, color: '#10B981' },
    { type: 'Bus', pct: 10, color: '#F59E0B' },
    { type: 'Trek', pct: 5, color: '#8B5CF6' },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[#1A3C5E]">
          Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}
        </h1>
        <p className="text-gray-500 text-sm">{today}</p>
      </motion.div>

      {/* Stat Rings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="pt-6 pb-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
            ))
          : statRings.map((stat) => <StatRingCard key={stat.label} stat={stat} />)}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Trips</CardTitle>
              <Link href="/trips">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentTrips.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No trips yet. Start your first adventure!</p>
                  <Link href="/trips/new">
                    <Button className="mt-3 bg-[#E8733A] hover:bg-[#d4642e]" size="sm">
                      Plan a Trip
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTrips.map((trip: any) => (
                    <Link key={trip.id} href={`/trips/${trip.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center">
                          {(() => {
                            const Icon = vehicleIcons[trip.vehicleType] || Car;
                            return <Icon className="w-5 h-5 text-[#1A3C5E]" />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#1A3C5E] truncate">{trip.title}</p>
                          <p className="text-xs text-gray-500">
                            {trip.source} → {trip.destination}
                          </p>
                        </div>
                        <Badge
                          variant={trip.status === 'completed' ? 'default' : 'secondary'}
                          className={cn(
                            'text-xs',
                            trip.status === 'active' && 'bg-green-100 text-green-700',
                            trip.status === 'completed' && 'bg-blue-100 text-blue-700',
                            trip.status === 'planning' && 'bg-yellow-100 text-yellow-700',
                          )}
                        >
                          {trip.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <button className="w-full flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white', action.color)}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{action.label}</span>
                  </button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badge Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Badge Showcase</CardTitle>
              <Link href="/badges">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : recentBadges.length === 0 ? (
                <div className="text-center py-6">
                  <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Start traveling to earn badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {recentBadges.map((badge: any) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E8733A]/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-[#E8733A]" />
                      </div>
                      <span className="text-xs font-medium text-center text-[#1A3C5E] line-clamp-1">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progress & Vehicle Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium capitalize text-[#1A3C5E]">
                  {userLevel || 'Wanderer'}
                </span>
                <span className="text-xs text-gray-500">
                  {xp || 0} / {nextLevelXp || 500} XP
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicleBreakdown.map((v) => (
                  <div key={v.type} className="flex items-center gap-3">
                    <span className="text-xs w-12 text-gray-600">{v.type}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${v.pct}%`, backgroundColor: v.color }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{v.pct}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
