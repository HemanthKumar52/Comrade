'use client';
import * as React from 'react';
import { MapPin, Navigation, User, Users, UsersRound, Crown, Car, Bike, Bus, Train, Plane, Ship } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';

type TravelerType = 'solo' | 'duo' | 'squad' | 'group';
type RouteMode = 'auto' | 'manual';

interface TripPlannerProps {
  onPlan?: (data: {
    source: string;
    destination: string;
    travelerType: TravelerType;
    vehicleType: string;
    routeMode: RouteMode;
    startDate: string;
    endDate: string;
  }) => void;
}

const travelerOptions = [
  { type: 'solo' as const, label: 'Solo', icon: User, description: 'Just me' },
  { type: 'duo' as const, label: 'Duo', icon: Users, description: '2 travelers' },
  { type: 'squad' as const, label: 'Squad', icon: UsersRound, description: '3-5 travelers' },
  { type: 'group' as const, label: 'Group', icon: Crown, description: '6+ travelers' },
];

const vehicleOptions = [
  { value: 'car', label: 'Car', icon: Car },
  { value: 'bike', label: 'Bike', icon: Bike },
  { value: 'bus', label: 'Bus', icon: Bus },
  { value: 'train', label: 'Train', icon: Train },
  { value: 'plane', label: 'Plane', icon: Plane },
  { value: 'ship', label: 'Ship', icon: Ship },
];

export function TripPlanner({ onPlan }: TripPlannerProps) {
  const [source, setSource] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [travelerType, setTravelerType] = React.useState<TravelerType>('solo');
  const [vehicleType, setVehicleType] = React.useState('car');
  const [routeMode, setRouteMode] = React.useState<RouteMode>('auto');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlan?.({ source, destination, travelerType, vehicleType, routeMode, startDate, endDate });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-accent" />
          Plan Your Trip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source & Destination */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="From"
              placeholder="Starting point"
              icon={<MapPin className="h-4 w-4" />}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
            <Input
              label="To"
              placeholder="Destination"
              icon={<MapPin className="h-4 w-4" />}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Traveler Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Traveler Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {travelerOptions.map((option) => {
                const Icon = option.icon;
                const selected = travelerType === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setTravelerType(option.type)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all',
                      selected
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{option.label}</span>
                    <span className="text-[10px] opacity-70">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle
            </label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicleOptions.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    <span className="flex items-center gap-2">
                      <v.icon className="h-4 w-4" />
                      {v.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Route Mode */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Route Mode
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              {(['auto', 'manual'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRouteMode(mode)}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium transition-colors capitalize',
                    routeMode === mode
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <Button type="submit" variant="accent" size="lg" className="w-full">
            <Navigation className="mr-2 h-5 w-5" />
            Plan Route
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
