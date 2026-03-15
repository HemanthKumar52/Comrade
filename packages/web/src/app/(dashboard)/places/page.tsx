'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Compass, Mountain, Camera, TreePine, Waves, Building2, ShoppingBag,
  Coffee, Music, Palette, MapPin, Search, Star, Sparkles, Eye,
  Church, Landmark, Castle, Tent, Filter, Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DiscoveredPlace {
  id: string;
  name: string;
  category: string;
  distance: number;
  description: string;
  tags: string[];
  isHiddenGem: boolean;
  isFree: boolean;
  rating: number;
  lat: number;
  lng: number;
}

const categories = [
  { key: 'all', label: 'All', icon: Compass },
  { key: 'landmark', label: 'Landmarks', icon: Landmark },
  { key: 'museum', label: 'Museums', icon: Building2 },
  { key: 'temple', label: 'Temples', icon: Church },
  { key: 'park', label: 'Parks', icon: TreePine },
  { key: 'beach', label: 'Beaches', icon: Waves },
  { key: 'viewpoint', label: 'Viewpoints', icon: Mountain },
  { key: 'market', label: 'Markets', icon: ShoppingBag },
  { key: 'cafe', label: 'Cafes', icon: Coffee },
  { key: 'art', label: 'Art', icon: Palette },
  { key: 'nightlife', label: 'Nightlife', icon: Music },
  { key: 'castle', label: 'Castles', icon: Castle },
];

const mockPlaces: DiscoveredPlace[] = [
  { id: '1', name: 'Meenakshi Amman Temple', category: 'temple', distance: 0.5, description: 'Ancient Hindu temple with stunning gopurams and intricate carvings dating back to the 6th century.', tags: ['historic', 'architecture', 'spiritual'], isHiddenGem: false, isFree: false, rating: 4.8, lat: 9.9195, lng: 78.1193 },
  { id: '2', name: 'Gandhi Memorial Museum', category: 'museum', distance: 1.2, description: 'Museum dedicated to Mahatma Gandhi with rare photographs and personal belongings.', tags: ['history', 'culture', 'educational'], isHiddenGem: false, isFree: true, rating: 4.5, lat: 9.9178, lng: 78.1217 },
  { id: '3', name: 'Thirumalai Nayak Palace', category: 'landmark', distance: 0.8, description: 'A 17th-century palace blending Dravidian and Islamic styles with a magnificent courtyard.', tags: ['architecture', 'historic', 'photography'], isHiddenGem: false, isFree: false, rating: 4.3, lat: 9.9171, lng: 78.1208 },
  { id: '4', name: 'Vaigai Dam Viewpoint', category: 'viewpoint', distance: 5.2, description: 'Panoramic views of the dam and surrounding green hills. Best at sunrise.', tags: ['nature', 'photography', 'sunrise'], isHiddenGem: true, isFree: true, rating: 4.6, lat: 9.9553, lng: 78.0164 },
  { id: '5', name: 'Koodal Azhagar Temple', category: 'temple', distance: 0.6, description: 'Rare Vishnu temple with three levels representing three poses of the deity.', tags: ['spiritual', 'architecture', 'unique'], isHiddenGem: true, isFree: true, rating: 4.4, lat: 9.9186, lng: 78.1189 },
  { id: '6', name: 'Banana Market (Mattuthavani)', category: 'market', distance: 3.1, description: 'One of Asia\'s largest banana markets. A chaotic, colorful experience.', tags: ['local life', 'food', 'unique'], isHiddenGem: true, isFree: true, rating: 4.2, lat: 9.9404, lng: 78.1384 },
  { id: '7', name: 'Jigarthanda Corner', category: 'cafe', distance: 0.4, description: 'Famous Madurai specialty cold drink — a must-try local experience.', tags: ['food', 'local', 'iconic'], isHiddenGem: false, isFree: false, rating: 4.7, lat: 9.9197, lng: 78.1195 },
  { id: '8', name: 'Mariamman Teppakulam', category: 'park', distance: 2.5, description: 'Historic tank garden with a temple island. Beautiful during Float Festival.', tags: ['heritage', 'peaceful', 'photography'], isHiddenGem: true, isFree: true, rating: 4.1, lat: 9.9102, lng: 78.1305 },
  { id: '9', name: 'Samanar Hills (Keelakuyilkudi)', category: 'viewpoint', distance: 12.0, description: 'Ancient Jain rock-cut caves with 2000-year-old inscriptions and hilltop views.', tags: ['trekking', 'history', 'caves'], isHiddenGem: true, isFree: true, rating: 4.5, lat: 9.8778, lng: 78.2108 },
  { id: '10', name: 'Athisayam Theme Park', category: 'landmark', distance: 8.5, description: 'Fun amusement and water park, great for families and groups.', tags: ['family', 'fun', 'water sports'], isHiddenGem: false, isFree: false, rating: 3.9, lat: 9.9674, lng: 78.0501 },
  { id: '11', name: 'Pudhu Mandapam', category: 'landmark', distance: 0.3, description: 'A 17th-century hall with 124 carved pillars, now a bustling tailoring market.', tags: ['architecture', 'shopping', 'heritage'], isHiddenGem: false, isFree: true, rating: 4.2, lat: 9.9194, lng: 78.1197 },
  { id: '12', name: 'Alagar Kovil', category: 'temple', distance: 21.0, description: 'Hilltop Vishnu temple surrounded by lush forest and waterfalls.', tags: ['nature', 'spiritual', 'trekking'], isHiddenGem: true, isFree: true, rating: 4.6, lat: 10.0514, lng: 78.2014 },
  { id: '13', name: 'Art Junction Gallery', category: 'art', distance: 1.8, description: 'Contemporary art gallery showcasing local Tamil Nadu artists and sculptors.', tags: ['art', 'culture', 'modern'], isHiddenGem: true, isFree: true, rating: 4.0, lat: 9.9234, lng: 78.1256 },
  { id: '14', name: 'Marina Rooftop Lounge', category: 'nightlife', distance: 2.0, description: 'Rooftop dining with live music and views of the temple city skyline.', tags: ['dining', 'music', 'views'], isHiddenGem: true, isFree: false, rating: 4.3, lat: 9.9215, lng: 78.1242 },
  { id: '15', name: 'Pazhamudhir Solai', category: 'park', distance: 22.0, description: 'One of the six abodes of Murugan, surrounded by fruit orchards and hills.', tags: ['pilgrimage', 'nature', 'peaceful'], isHiddenGem: false, isFree: true, rating: 4.4, lat: 10.0478, lng: 78.2178 },
];

const categoryColors: Record<string, string> = {
  temple: 'bg-orange-100 text-orange-700',
  museum: 'bg-blue-100 text-blue-700',
  landmark: 'bg-purple-100 text-purple-700',
  viewpoint: 'bg-emerald-100 text-emerald-700',
  park: 'bg-green-100 text-green-700',
  beach: 'bg-cyan-100 text-cyan-700',
  market: 'bg-amber-100 text-amber-700',
  cafe: 'bg-rose-100 text-rose-700',
  art: 'bg-pink-100 text-pink-700',
  nightlife: 'bg-violet-100 text-violet-700',
  castle: 'bg-stone-100 text-stone-700',
};

export default function PlacesDiscoveryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [radius, setRadius] = useState(10);
  const [showHiddenGems, setShowHiddenGems] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
      if (place.distance > radius) return false;
      if (showHiddenGems && !place.isHiddenGem) return false;
      if (showFreeOnly && !place.isFree) return false;
      if (search) {
        const q = search.toLowerCase();
        return place.name.toLowerCase().includes(q) || place.description.toLowerCase().includes(q) || place.tags.some(t => t.includes(q));
      }
      return true;
    });
  }, [search, selectedCategory, radius, showHiddenGems, showFreeOnly]);

  const hiddenGems = mockPlaces.filter(p => p.isHiddenGem);
  const freeActivities = mockPlaces.filter(p => p.isFree);
  const photoSpots = mockPlaces.filter(p => p.tags.includes('photography') || p.category === 'viewpoint');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C5E]">Places Discovery</h1>
        <p className="text-gray-500 text-sm mt-1">Explore landmarks, hidden gems, and free activities nearby</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search places, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      selectedCategory === cat.key
                        ? 'bg-[#E8733A] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Radius:</span>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-24 accent-[#E8733A]"
                />
                <span className="text-xs font-medium text-[#1A3C5E]">{radius} km</span>
              </div>
              <button
                onClick={() => setShowHiddenGems(!showHiddenGems)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  showHiddenGems ? 'bg-[#1A3C5E] text-white' : 'bg-gray-100 text-gray-600'
                )}
              >
                <Sparkles className="w-3 h-3" /> Hidden Gems
              </button>
              <button
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  showFreeOnly ? 'bg-[#1A3C5E] text-white' : 'bg-gray-100 text-gray-600'
                )}
              >
                <Heart className="w-3 h-3" /> Free Only
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Places', value: filteredPlaces.length, icon: MapPin, color: '#1A3C5E' },
          { label: 'Hidden Gems', value: hiddenGems.length, icon: Sparkles, color: '#E8733A' },
          { label: 'Free Activities', value: freeActivities.length, icon: Heart, color: '#22c55e' },
          { label: 'Photo Spots', value: photoSpots.length, icon: Camera, color: '#8b5cf6' },
        ].map((stat, i) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A3C5E]">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1A3C5E]">
            {selectedCategory === 'all' ? 'All Places' : categories.find(c => c.key === selectedCategory)?.label}
            <span className="text-sm font-normal text-gray-400 ml-2">({filteredPlaces.length})</span>
          </h2>
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">within {radius}km</span>
          </div>
        </div>

        {filteredPlaces.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No places found. Try adjusting your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1A3C5E] text-sm leading-tight">{place.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={cn('text-[10px] py-0', categoryColors[place.category] || 'bg-gray-100 text-gray-600')}>
                            {place.category}
                          </Badge>
                          <span className="text-[10px] text-gray-400">{place.distance} km</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-[#1A3C5E]">{place.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{place.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {place.isHiddenGem && (
                        <Badge className="bg-[#E8733A]/10 text-[#E8733A] text-[10px] py-0 gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Hidden Gem
                        </Badge>
                      )}
                      {place.isFree && (
                        <Badge className="bg-green-100 text-green-700 text-[10px] py-0">Free</Badge>
                      )}
                      {place.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] py-0 text-gray-500">{tag}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#E8733A] hover:text-[#d4642e] px-2">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hidden Gems */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E8733A]" />
                Hidden Gems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hiddenGems.slice(0, 5).map((place, i) => (
                <div key={place.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E8733A]/10 flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A3C5E]">{place.name}</p>
                      <p className="text-[10px] text-gray-400">{place.distance} km · {place.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-[#1A3C5E]">{place.rating}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Photo Spots */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E8733A]" />
                Photo Spots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {photoSpots.slice(0, 5).map((place, i) => (
                <div key={place.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sm">
                      📸
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A3C5E]">{place.name}</p>
                      <p className="text-[10px] text-gray-400">{place.distance} km · {place.category}</p>
                    </div>
                  </div>
                  {place.isFree && (
                    <Badge className="bg-green-100 text-green-700 text-[10px] py-0">Free</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
