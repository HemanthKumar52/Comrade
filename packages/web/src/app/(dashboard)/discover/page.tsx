'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Compass, Mountain, Camera, TreePine, Waves, Building, ShoppingBag, Coffee, Music, Palette,
  MapPin, Search, Star, Eye, Gem, Ticket, SlidersHorizontal, Heart, Clock, Navigation,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/* ──────────────── Types ──────────────── */

type Category = 'All' | 'Landmarks' | 'Museums' | 'Temples' | 'Parks' | 'Beaches' | 'Viewpoints' | 'Markets' | 'Cafes' | 'Nightlife' | 'Art';

interface Place {
  id: number;
  name: string;
  category: Exclude<Category, 'All'>;
  distance: number; // km
  rating: number;
  description: string;
  isHiddenGem: boolean;
  isFree: boolean;
  isPhotoSpot: boolean;
  openHours: string;
  tags: string[];
}

/* ──────────────── Mock Data ──────────────── */

const mockPlaces: Place[] = [
  { id: 1, name: 'Gateway of India', category: 'Landmarks', distance: 1.2, rating: 4.7, description: 'Iconic arch monument overlooking the Arabian Sea, built in 1924.', isHiddenGem: false, isFree: true, isPhotoSpot: true, openHours: 'Open 24 hours', tags: ['historic', 'waterfront'] },
  { id: 2, name: 'Chhatrapati Shivaji Maharaj Museum', category: 'Museums', distance: 1.5, rating: 4.5, description: 'Premier art and history museum with over 50,000 artifacts from India and beyond.', isHiddenGem: false, isFree: false, isPhotoSpot: true, openHours: '10:15 AM - 6:00 PM', tags: ['art', 'history'] },
  { id: 3, name: 'Siddhivinayak Temple', category: 'Temples', distance: 5.8, rating: 4.8, description: 'One of the most famous Ganesh temples in Mumbai, built in 1801.', isHiddenGem: false, isFree: true, isPhotoSpot: false, openHours: '5:30 AM - 10:00 PM', tags: ['spiritual', 'architecture'] },
  { id: 4, name: 'Sanjay Gandhi National Park', category: 'Parks', distance: 18.5, rating: 4.4, description: 'Sprawling 104 sq km urban park with Kanheri Caves, leopards, and hiking trails.', isHiddenGem: false, isFree: false, isPhotoSpot: true, openHours: '7:30 AM - 6:30 PM', tags: ['nature', 'wildlife', 'hiking'] },
  { id: 5, name: 'Juhu Beach', category: 'Beaches', distance: 12.3, rating: 4.1, description: 'Famous beach known for street food, sunset views, and celebrity spotting.', isHiddenGem: false, isFree: true, isPhotoSpot: true, openHours: 'Open 24 hours', tags: ['food', 'sunset'] },
  { id: 6, name: 'Bandra Fort Viewpoint', category: 'Viewpoints', distance: 8.7, rating: 4.3, description: 'Remnants of a Portuguese fort with stunning views of the Bandra-Worli Sea Link.', isHiddenGem: true, isFree: true, isPhotoSpot: true, openHours: '6:00 AM - 9:00 PM', tags: ['sunset', 'historic'] },
  { id: 7, name: 'Crawford Market', category: 'Markets', distance: 2.1, rating: 4.2, description: 'Historic market with Rudyard Kipling connections. Fresh produce, pets, and antiques.', isHiddenGem: false, isFree: true, isPhotoSpot: false, openHours: '11:00 AM - 8:00 PM', tags: ['shopping', 'food'] },
  { id: 8, name: 'Prithvi Cafe', category: 'Cafes', distance: 9.2, rating: 4.6, description: 'Iconic theater cafe in Juhu known for its Irish coffee and cultural vibe.', isHiddenGem: true, isFree: true, isPhotoSpot: false, openHours: '11:00 AM - 11:00 PM', tags: ['coffee', 'theater'] },
  { id: 9, name: 'Toto\'s Garage', category: 'Nightlife', distance: 8.9, rating: 4.4, description: 'Legendary Bandra pub with rock music, quirky decor, and great cocktails.', isHiddenGem: true, isFree: false, isPhotoSpot: false, openHours: '7:00 PM - 1:30 AM', tags: ['music', 'drinks'] },
  { id: 10, name: 'Kala Ghoda Art District', category: 'Art', distance: 1.8, rating: 4.5, description: 'Vibrant art district with galleries, street art, and the annual Kala Ghoda festival.', isHiddenGem: false, isFree: true, isPhotoSpot: true, openHours: 'Open 24 hours', tags: ['art', 'culture', 'walking'] },
  { id: 11, name: 'Worli Fort', category: 'Viewpoints', distance: 7.2, rating: 4.0, description: 'Hidden 17th-century Portuguese fort with panoramic sea views away from crowds.', isHiddenGem: true, isFree: true, isPhotoSpot: true, openHours: '7:00 AM - 6:00 PM', tags: ['historic', 'quiet'] },
  { id: 12, name: 'Chor Bazaar', category: 'Markets', distance: 3.1, rating: 4.1, description: 'Famously quirky flea market where you can find antiques, vintage items, and curiosities.', isHiddenGem: true, isFree: true, isPhotoSpot: true, openHours: '11:00 AM - 7:30 PM', tags: ['antiques', 'unique'] },
  { id: 13, name: 'Dr. Bhau Daji Lad Museum', category: 'Museums', distance: 6.5, rating: 4.6, description: 'Mumbai\'s oldest museum with stunning Victorian interiors and decorative arts.', isHiddenGem: true, isFree: false, isPhotoSpot: true, openHours: '10:00 AM - 5:30 PM', tags: ['art', 'history', 'architecture'] },
  { id: 14, name: 'Versova Beach', category: 'Beaches', distance: 14.8, rating: 3.9, description: 'Quieter alternative to Juhu, famous for its cleanup transformation and fishing village.', isHiddenGem: true, isFree: true, isPhotoSpot: true, openHours: 'Open 24 hours', tags: ['quiet', 'sunset', 'local'] },
  { id: 15, name: 'Hanging Gardens', category: 'Parks', distance: 4.1, rating: 4.2, description: 'Terraced gardens on Malabar Hill with animal-shaped hedges and city views.', isHiddenGem: false, isFree: true, isPhotoSpot: true, openHours: '5:00 AM - 9:00 PM', tags: ['garden', 'views'] },
  { id: 16, name: 'Haji Ali Dargah', category: 'Temples', distance: 5.4, rating: 4.6, description: 'Stunning mosque on an islet accessible only at low tide via a narrow causeway.', isHiddenGem: false, isFree: true, isPhotoSpot: true, openHours: '5:30 AM - 10:00 PM', tags: ['spiritual', 'architecture', 'tidal'] },
  { id: 17, name: 'Sassoon Docks', category: 'Art', distance: 2.8, rating: 4.3, description: 'Working fishing dock transformed into an art space during the annual art festival.', isHiddenGem: true, isFree: true, isPhotoSpot: true, openHours: '5:00 AM - 12:00 PM', tags: ['art', 'photography', 'local'] },
  { id: 18, name: 'Leopard Cafe', category: 'Cafes', distance: 1.3, rating: 4.3, description: 'Iconic Colaba cafe since 1871, famous from the book Shantaram. Great for people-watching.', isHiddenGem: false, isFree: true, isPhotoSpot: false, openHours: '7:30 AM - 12:00 AM', tags: ['heritage', 'food'] },
];

const categories: { name: Category; icon: React.ElementType; color: string }[] = [
  { name: 'All', icon: Compass, color: 'bg-[#1A3C5E] text-white' },
  { name: 'Landmarks', icon: Building, color: 'bg-blue-100 text-blue-700' },
  { name: 'Museums', icon: Building, color: 'bg-purple-100 text-purple-700' },
  { name: 'Temples', icon: Star, color: 'bg-amber-100 text-amber-700' },
  { name: 'Parks', icon: TreePine, color: 'bg-green-100 text-green-700' },
  { name: 'Beaches', icon: Waves, color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Viewpoints', icon: Mountain, color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Markets', icon: ShoppingBag, color: 'bg-pink-100 text-pink-700' },
  { name: 'Cafes', icon: Coffee, color: 'bg-orange-100 text-orange-700' },
  { name: 'Nightlife', icon: Music, color: 'bg-violet-100 text-violet-700' },
  { name: 'Art', icon: Palette, color: 'bg-rose-100 text-rose-700' },
];

const categoryColorMap: Record<string, string> = {
  Landmarks: 'bg-blue-100 text-blue-700',
  Museums: 'bg-purple-100 text-purple-700',
  Temples: 'bg-amber-100 text-amber-700',
  Parks: 'bg-green-100 text-green-700',
  Beaches: 'bg-cyan-100 text-cyan-700',
  Viewpoints: 'bg-indigo-100 text-indigo-700',
  Markets: 'bg-pink-100 text-pink-700',
  Cafes: 'bg-orange-100 text-orange-700',
  Nightlife: 'bg-violet-100 text-violet-700',
  Art: 'bg-rose-100 text-rose-700',
};

/* ──────────────── Component ──────────────── */

export default function DiscoverPage() {
  const [location, setLocation] = useState('Mumbai, India');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [radius, setRadius] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
      const matchesRadius = place.distance <= radius;
      const matchesSearch = !searchQuery || place.name.toLowerCase().includes(searchQuery.toLowerCase()) || place.tags.some((t) => t.includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesRadius && matchesSearch;
    });
  }, [selectedCategory, radius, searchQuery]);

  const popularLandmarks = useMemo(() => filteredPlaces.filter((p) => !p.isHiddenGem && p.rating >= 4.3), [filteredPlaces]);
  const hiddenGems = useMemo(() => filteredPlaces.filter((p) => p.isHiddenGem), [filteredPlaces]);
  const freeThings = useMemo(() => filteredPlaces.filter((p) => p.isFree), [filteredPlaces]);
  const photoSpots = useMemo(() => filteredPlaces.filter((p) => p.isPhotoSpot), [filteredPlaces]);

  const renderPlaceCard = (place: Place, index: number, delayBase: number) => (
    <motion.div
      key={place.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delayBase + index * 0.04 }}
    >
      <Card className="hover:shadow-lg transition-all h-full group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1A3C5E] group-hover:text-[#E8733A] transition-colors truncate">
                {place.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn('text-xs', categoryColorMap[place.category])}>
                  {place.category}
                </Badge>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> {place.distance} km
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-[#1A3C5E]">{place.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{place.description}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {place.isHiddenGem && (
              <Badge className="bg-[#E8733A]/10 text-[#E8733A] text-xs gap-1">
                <Gem className="w-3 h-3" /> Hidden Gem
              </Badge>
            )}
            {place.isFree && (
              <Badge className="bg-green-100 text-green-700 text-xs gap-1">
                <Ticket className="w-3 h-3" /> Free
              </Badge>
            )}
            {place.isPhotoSpot && (
              <Badge className="bg-blue-100 text-blue-700 text-xs gap-1">
                <Camera className="w-3 h-3" /> Photo Spot
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {place.openHours}
            </span>
            <Button variant="ghost" size="sm" className="text-xs text-[#E8733A] hover:text-[#E8733A] hover:bg-[#E8733A]/10 h-7 px-2">
              <Heart className="w-3 h-3 mr-1" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E]">Discover</h1>
        <p className="text-gray-500 text-sm mt-1">Find amazing places, hidden gems, and free activities nearby</p>
      </motion.div>

      {/* Location & Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or coordinates..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30 focus:border-[#E8733A] shadow-sm"
          />
        </div>
      </motion.div>

      {/* Category Filter Pills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
                  isActive
                    ? 'bg-[#1A3C5E] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8733A]/30 hover:text-[#E8733A]'
                )}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Radius Slider */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <SlidersHorizontal className="w-4 h-4 text-[#E8733A] shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1A3C5E]">Search Radius</span>
                  <span className="text-sm font-bold text-[#E8733A]">{radius} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E8733A]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 km</span>
                  <span>10 km</span>
                  <span>20 km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Places Found', value: filteredPlaces.length, icon: Compass, color: 'bg-blue-50 text-blue-600' },
            { label: 'Hidden Gems', value: hiddenGems.length, icon: Gem, color: 'bg-orange-50 text-[#E8733A]' },
            { label: 'Free Activities', value: freeThings.length, icon: Ticket, color: 'bg-green-50 text-green-600' },
            { label: 'Photo Spots', value: photoSpots.length, icon: Camera, color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A3C5E]">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Popular Landmarks */}
      {popularLandmarks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Popular Landmarks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularLandmarks.slice(0, 6).map((place, i) => renderPlaceCard(place, i, 0.25))}
          </div>
        </motion.div>
      )}

      {/* Hidden Gems */}
      {hiddenGems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#E8733A] via-[#e8843a] to-[#d4622e] p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Gem className="w-5 h-5" />
                <h2 className="text-lg font-bold">Hidden Gems</h2>
              </div>
              <p className="text-sm opacity-90">Lesser-known spots loved by locals</p>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hiddenGems.map((place, i) => renderPlaceCard(place, i, 0.3))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Free Things to Do */}
      {freeThings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-lg font-bold text-[#1A3C5E] mb-3 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-green-500" />
            Free Things to Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeThings.slice(0, 6).map((place, i) => renderPlaceCard(place, i, 0.35))}
          </div>
        </motion.div>
      )}

      {/* Photo Spots */}
      {photoSpots.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E8733A]" />
                Photo Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photoSpots.slice(0, 6).map((place, i) => renderPlaceCard(place, i, 0.4))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredPlaces.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardContent className="p-12 text-center">
              <Compass className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-[#1A3C5E] mb-2">No places found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or increasing the search radius</p>
              <Button
                className="mt-4 bg-[#E8733A] hover:bg-[#d4622e] text-white"
                onClick={() => { setSelectedCategory('All'); setRadius(20); setSearchQuery(''); }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
