'use client';
import { MapPin, Route, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { getInitials } from '@/lib/utils';

interface PartnerCardProps {
  id: string;
  name: string;
  avatar?: string;
  level: string;
  totalKm: number;
  totalTrips: number;
  rating: number;
  onConnect?: (id: string) => void;
  connected?: boolean;
}

export function PartnerCard({
  id,
  name,
  avatar,
  level,
  totalKm,
  totalTrips,
  rating,
  onConnect,
  connected = false,
}: PartnerCardProps) {
  return (
    <Card className="text-center">
      <CardContent className="p-5">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <Avatar size="lg">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Name & Level */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{name}</h3>
        <Badge variant="accent" className="mt-1">
          {level}
        </Badge>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <MapPin className="h-3.5 w-3.5 text-gray-400 mb-0.5" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {totalKm >= 1000 ? `${(totalKm / 1000).toFixed(1)}k` : totalKm}
            </span>
            <span className="text-[10px] text-gray-400">km</span>
          </div>
          <div className="flex flex-col items-center">
            <Route className="h-3.5 w-3.5 text-gray-400 mb-0.5" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{totalTrips}</span>
            <span className="text-[10px] text-gray-400">trips</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 mb-0.5" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-gray-400">rating</span>
          </div>
        </div>

        {/* Connect button */}
        <Button
          variant={connected ? 'outline' : 'accent'}
          size="sm"
          className="mt-4 w-full"
          onClick={() => onConnect?.(id)}
          disabled={connected}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  );
}
