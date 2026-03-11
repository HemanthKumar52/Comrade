'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Layers, Navigation, Plus, X, MapPin, Coffee, Hotel, Utensils, Mountain, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import MapContainer from '@/components/maps/map-container';
import MapControls from '@/components/maps/map-controls';
import { useMapStore } from '@/stores/useMapStore';
import { cn } from '@/lib/utils';

const poiLayers = [
  { id: 'tea_shop', label: 'Tea Shops', icon: Coffee },
  { id: 'hotel', label: 'Hotels', icon: Hotel },
  { id: 'restaurant', label: 'Restaurants', icon: Utensils },
  { id: 'scenic', label: 'Scenic', icon: Mountain },
  { id: 'historic', label: 'Historic', icon: Landmark },
];

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [activeLayers, setActiveLayers] = useState<string[]>(['scenic']);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative -m-4 sm:-m-6 lg:-m-8" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Map */}
      <MapContainer className="w-full h-full" />

      {/* Search Bar Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-20 sm:right-auto sm:w-80 z-10"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white shadow-lg border-0"
          />
        </div>
      </motion.div>

      {/* Map Controls Overlay */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-10"
      >
        <MapControls />
      </motion.div>

      {/* Layer Toggle Button */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-20 right-4 z-10"
      >
        <Button
          variant="secondary"
          size="icon"
          className="bg-white shadow-lg"
          onClick={() => setShowLayerPanel(!showLayerPanel)}
        >
          <Layers className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* POI Layer Panel */}
      {showLayerPanel && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-32 right-4 z-10 w-56"
        >
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#1A3C5E]">POI Layers</h3>
                <button onClick={() => setShowLayerPanel(false)}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                {poiLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <layer.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{layer.label}</span>
                    </div>
                    <Switch
                      checked={activeLayers.includes(layer.id)}
                      onCheckedChange={() => toggleLayer(layer.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Start Trip FAB */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <Button
          size="lg"
          className="bg-[#E8733A] hover:bg-[#d4642e] shadow-lg gap-2 px-8 rounded-full"
        >
          <Navigation className="w-5 h-5" />
          Start Trip
        </Button>
      </motion.div>

      {/* Location Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-6 right-4 z-10"
      >
        <Button variant="secondary" size="icon" className="bg-white shadow-lg rounded-full">
          <MapPin className="w-5 h-5 text-[#1A3C5E]" />
        </Button>
      </motion.div>
    </div>
  );
}
