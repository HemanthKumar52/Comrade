'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, MapPin, Coffee, Hotel, Utensils, Mountain, Landmark, Footprints, Wifi } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePOI } from '@/hooks/usePOI';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All', icon: MapPin },
  { id: 'hotel', label: 'Hotels', icon: Hotel },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'scenic', label: 'Scenic', icon: Mountain },
  { id: 'historic', label: 'Historic', icon: Landmark },
  { id: 'tea_shop', label: 'Tea Shops', icon: Coffee },
  { id: 'trailhead', label: 'Trails', icon: Footprints },
];

const categoryColors: Record<string, string> = {
  hotel: 'bg-blue-100 text-blue-700',
  restaurant: 'bg-orange-100 text-orange-700',
  scenic: 'bg-green-100 text-green-700',
  historic: 'bg-purple-100 text-purple-700',
  tea_shop: 'bg-amber-100 text-amber-700',
  trailhead: 'bg-emerald-100 text-emerald-700',
  wifi_hotspot: 'bg-cyan-100 text-cyan-700',
};

export default function ExplorePage() {
  const { pois, isLoading } = usePOI();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? pois || []
    : (pois || []).filter((p: any) => p.category === activeCategory);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#1A3C5E]">Explore</h1>
          <p className="text-gray-500 text-sm">Discover amazing places around you</p>
        </div>
        <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2">
          <Plus className="w-4 h-4" />
          Add New POI
        </Button>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === cat.id
                ? 'bg-[#1A3C5E] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
            )}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Mini Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="h-48 bg-gradient-to-br from-[#1A3C5E]/5 to-[#1A3C5E]/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#1A3C5E]/30 mx-auto mb-2" />
                <p className="text-sm text-gray-400">POI map view</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* POI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-32" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No places found</h3>
          <p className="text-gray-500 mb-4">Be the first to add a POI in this category!</p>
          <Button className="bg-[#E8733A] hover:bg-[#d4642e]">Add a Place</Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((poi: any, i: number) => (
            <motion.div
              key={poi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={cn('text-xs capitalize', categoryColors[poi.category] || 'bg-gray-100 text-gray-700')}>
                      {poi.category?.replace('_', ' ')}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{poi.rating}</span>
                      <span className="text-xs text-gray-400">({poi.totalRatings})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#1A3C5E] mb-1">{poi.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{poi.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>2.3 km away</span>
                    {poi.wheelchairAccessible && (
                      <Badge variant="outline" className="text-xs ml-auto">Accessible</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
