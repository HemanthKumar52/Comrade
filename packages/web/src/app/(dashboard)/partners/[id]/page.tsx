'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, Shield, MapPin, Route, Trophy, Calendar,
  Send, MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { usePartners } from '@/hooks/usePartners';
import { getInitials } from '@/lib/utils';

export default function PartnerProfilePage() {
  const params = useParams();
  const partnerId = params.id as string;
  const { partners, isLoading } = usePartners();
  const partner = partners?.find((p: any) => (p.userId || p.id) === partnerId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  // Use mock data if partner not found
  const profile = partner || {
    name: 'Traveler',
    level: 'Explorer',
    rating: 4.5,
    verified: true,
    bio: 'Passionate traveler exploring the world one trip at a time.',
    travelStats: { totalKm: 5200, placesVisited: 42, tripsCompleted: 28, travelStreak: 12 },
    badges: [],
    pastTrips: [],
    reviews: [],
  };

  const statItems = [
    { label: 'Total KM', value: profile.travelStats?.totalKm || 0, icon: Route },
    { label: 'Places', value: profile.travelStats?.placesVisited || 0, icon: MapPin },
    { label: 'Trips', value: profile.travelStats?.tripsCompleted || 0, icon: Calendar },
    { label: 'Streak', value: profile.travelStats?.travelStreak || 0, icon: Trophy },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/partners">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Partners
          </Button>
        </Link>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24 bg-[#1A3C5E] text-white flex items-center justify-center text-3xl font-bold">
                <span>{getInitials(profile.name)}</span>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-bold text-[#1A3C5E]">{profile.name}</h1>
                  {profile.verified && (
                    <Shield className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start mt-1">
                  <Badge variant="outline" className="capitalize">{profile.level}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{profile.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-3">{profile.bio}</p>
                <div className="flex gap-3 mt-4 justify-center sm:justify-start">
                  <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2">
                    <Send className="w-4 h-4" />
                    Send Trip Invite
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Travel Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {statItems.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <stat.icon className="w-5 h-5 text-[#E8733A] mx-auto mb-2" />
              <p className="text-xl font-bold text-[#1A3C5E]">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Badge Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            {(profile.badges?.length || 0) === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No badges to display</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {profile.badges.map((badge: any, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-xs text-center line-clamp-1">{badge.name || badge}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Past Trips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Past Trips</CardTitle>
          </CardHeader>
          <CardContent>
            {(profile.pastTrips?.length || 0) === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No public trips</p>
            ) : (
              <div className="space-y-3">
                {profile.pastTrips.map((trip: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#1A3C5E]" />
                    <div>
                      <p className="text-sm font-medium">{trip.title || trip}</p>
                      <p className="text-xs text-gray-500">{trip.date || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {(profile.reviews?.length || 0) === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {profile.reviews.map((review: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    {i < profile.reviews.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
