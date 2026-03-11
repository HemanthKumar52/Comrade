'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Car, Leaf, Users, FileText,
  Play, Square, UserPlus, Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { useTrips } from '@/hooks/useTrips';
import { cn, formatDistance, formatDuration } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  planning: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  paused: 'bg-gray-100 text-gray-700',
};

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  const { trips, isLoading } = useTrips();
  const trip = trips?.find((t: any) => t.id === tripId);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-16">
        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Trip not found</h3>
        <p className="text-gray-500 mb-4">This trip doesn&apos;t exist or has been removed.</p>
        <Link href="/trips">
          <Button className="bg-[#E8733A] hover:bg-[#d4642e]">Back to Trips</Button>
        </Link>
      </div>
    );
  }

  const infoCards = [
    { label: 'Distance', value: formatDistance ? formatDistance(trip.distanceKm) : `${trip.distanceKm} km`, icon: MapPin, color: 'text-blue-500' },
    { label: 'Duration', value: formatDuration ? formatDuration(trip.durationMin) : `${trip.durationMin} min`, icon: Clock, color: 'text-green-500' },
    { label: 'Vehicle', value: trip.vehicleType, icon: Car, color: 'text-[#E8733A]' },
    { label: 'Carbon', value: `${trip.carbonFootprint || 0} kg CO2`, icon: Leaf, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <Link href="/trips">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1A3C5E]">{trip.title}</h1>
            <Badge className={cn('text-xs', statusStyles[trip.status])}>
              {trip.status}
            </Badge>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {trip.source} → {trip.destination}
          </p>
        </div>
      </motion.div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="h-64 bg-gradient-to-br from-[#1A3C5E]/5 to-[#1A3C5E]/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-[#1A3C5E]/30 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Route map will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {infoCards.map((info) => (
          <Card key={info.label}>
            <CardContent className="p-4 text-center">
              <info.icon className={cn('w-6 h-6 mx-auto mb-2', info.color)} />
              <p className="text-lg font-semibold text-[#1A3C5E] capitalize">{info.value}</p>
              <p className="text-xs text-gray-500">{info.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        {trip.status === 'planning' && (
          <Button className="bg-green-600 hover:bg-green-700 gap-2">
            <Play className="w-4 h-4" />
            Start Trip
          </Button>
        )}
        {trip.status === 'active' && (
          <Button className="bg-red-600 hover:bg-red-700 gap-2">
            <Square className="w-4 h-4" />
            End Trip
          </Button>
        )}
        {(trip.type === 'duo' || trip.type === 'squad' || trip.type === 'group') && (
          <Button variant="outline" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Member
          </Button>
        )}
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Note
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        {(trip.type !== 'solo') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <Avatar className="w-8 h-8 bg-[#E8733A] text-white flex items-center justify-center text-sm font-medium">
                      <span>Y</span>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">You</p>
                      <p className="text-xs text-gray-500">Trip Lead</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Lead</Badge>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">No other members yet</p>
                    <Button variant="ghost" size="sm" className="mt-1 text-[#E8733A]">
                      Invite Partners
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Trip Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notes for this trip yet</p>
                <Link href="/notes/new">
                  <Button variant="ghost" size="sm" className="mt-1 text-[#E8733A]">
                    Create Note
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Completed Stats */}
      {trip.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#1A3C5E]">{trip.distanceKm}</p>
                  <p className="text-xs text-gray-500">KM Covered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A3C5E]">{trip.durationMin}</p>
                  <p className="text-xs text-gray-500">Minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A3C5E]">{trip.carbonFootprint || 0}</p>
                  <p className="text-xs text-gray-500">kg CO2</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#E8733A]">+50</p>
                  <p className="text-xs text-gray-500">XP Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
