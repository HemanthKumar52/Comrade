'use client';
import Link from 'next/link';
import { ArrowRight, Calendar, Car, Bike, Bus, Train, Plane, Ship, Clock, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { formatDistance, formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

type TripStatus = 'planned' | 'active' | 'completed' | 'cancelled';
type VehicleType = 'car' | 'bike' | 'bus' | 'train' | 'plane' | 'ship';
type TravelerType = 'solo' | 'duo' | 'squad' | 'group';

interface TripCardProps {
  id: string;
  title: string;
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  distanceKm?: number;
  durationMin?: number;
  vehicleType?: VehicleType;
  travelerType?: TravelerType;
}

const statusVariant: Record<TripStatus, 'info' | 'accent' | 'success' | 'danger'> = {
  planned: 'info',
  active: 'accent',
  completed: 'success',
  cancelled: 'danger',
};

const vehicleIcons: Record<VehicleType, React.ElementType> = {
  car: Car,
  bike: Bike,
  bus: Bus,
  train: Train,
  plane: Plane,
  ship: Ship,
};

const travelerColors: Record<TravelerType, string> = {
  solo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  duo: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  squad: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  group: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function TripCard({
  id,
  title,
  source,
  destination,
  startDate,
  endDate,
  status,
  distanceKm,
  durationMin,
  vehicleType = 'car',
  travelerType,
}: TripCardProps) {
  const VehicleIcon = vehicleIcons[vehicleType] || Car;

  return (
    <Link href={`/trips/${id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <Badge variant={statusVariant[status]} className="ml-2 shrink-0 capitalize">
              {status}
            </Badge>
          </div>

          {/* Route */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{source}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
            <span className="truncate">{destination}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              {' - '}
              {new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Footer stats */}
          <div className="flex items-center gap-3 flex-wrap">
            {distanceKm !== undefined && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3" />
                {formatDistance(distanceKm)}
              </span>
            )}
            {durationMin !== undefined && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                {formatDuration(durationMin)}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <VehicleIcon className="h-3.5 w-3.5" />
              <span className="capitalize">{vehicleType}</span>
            </span>
            {travelerType && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                  travelerColors[travelerType]
                )}
              >
                {travelerType}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
