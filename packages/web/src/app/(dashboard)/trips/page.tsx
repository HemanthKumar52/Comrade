'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, MapPin, Car, Bike, Bus, Train, Plane, Footprints, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrips } from '@/hooks/useTrips';
import { cn } from '@/lib/utils';

const statusTabs = ['All', 'Planning', 'Active', 'Completed', 'Cancelled'] as const;

const vehicleIcons: Record<string, React.ElementType> = {
  car: Car, bike: Bike, bus: Bus, train: Train, flight: Plane,
  trek: Footprints, bicycle: Bike, auto: Car,
};

const statusStyles: Record<string, string> = {
  planning: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  paused: 'bg-gray-100 text-gray-700',
};

export default function TripsPage() {
  const { trips, isLoading } = useTrips();
  const [activeTab, setActiveTab] = useState<string>('All');

  const filtered = activeTab === 'All'
    ? trips || []
    : (trips || []).filter((t: any) => t.status === activeTab.toLowerCase());

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-[#1A3C5E]">My Trips</h1>
        <Link href="/trips/new">
          <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2">
            <Plus className="w-4 h-4" />
            Plan New Trip
          </Button>
        </Link>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab
                ? 'bg-[#1A3C5E] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            )}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Trip Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-40 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No trips found</h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'All'
              ? "You haven't planned any trips yet. Start your adventure!"
              : `No ${activeTab.toLowerCase()} trips right now.`}
          </p>
          <Link href="/trips/new">
            <Button className="bg-[#E8733A] hover:bg-[#d4642e]">Plan Your First Trip</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((trip: any, i: number) => {
            const Icon = vehicleIcons[trip.vehicleType] || Car;
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/trips/${trip.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1A3C5E]/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#1A3C5E]" />
                        </div>
                        <Badge className={cn('text-xs', statusStyles[trip.status])}>
                          {trip.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-[#1A3C5E] mb-1">{trip.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {trip.source} → {trip.destination}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {trip.distanceKm} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {trip.startedAt
                            ? new Date(trip.startedAt).toLocaleDateString()
                            : 'Not started'}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {trip.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {trip.vehicleType}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
