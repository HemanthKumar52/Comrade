'use client';
import { MapPin, Star, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

interface DishCardProps {
  name: string;
  region: string;
  description: string;
  flavorTags: string[];
  mustTryScore: number; // 1-5
  averagePrice?: string;
  imageUrl?: string;
}

const flavorColors: Record<string, string> = {
  spicy: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  sweet: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  savory: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  sour: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  bitter: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  umami: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  mild: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  tangy: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export function DishCard({
  name,
  region,
  description,
  flavorTags,
  mustTryScore,
  averagePrice,
  imageUrl,
}: DishCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-lg">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🍽️</div>
        )}
        {/* Must-try score overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full bg-black/60 backdrop-blur-sm px-2 py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3 w-3',
                i < mustTryScore
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-400'
              )}
            />
          ))}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{name}</h3>

        {/* Region */}
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3 w-3" />
          {region}
        </div>

        {/* Description */}
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>

        {/* Flavor tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {flavorTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                flavorColors[tag.toLowerCase()] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        {averagePrice && (
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            <DollarSign className="h-3 w-3 text-accent" />
            Avg: {averagePrice}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
