'use client';
import * as React from 'react';
import { Box, Layers, Map as MapIcon } from 'lucide-react';
import { useMapStore } from '@/stores/map-store';
import { MAP_THEMES } from '@/lib/map';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

const layerOptions = [
  { key: 'hotels', label: 'Hotels', emoji: '🏨' },
  { key: 'restaurants', label: 'Restaurants', emoji: '🍽️' },
  { key: 'scenic', label: 'Scenic', emoji: '🏞️' },
  { key: 'historic', label: 'Historic', emoji: '🏛️' },
];

const themeOptions = Object.keys(MAP_THEMES) as (keyof typeof MAP_THEMES)[];

export function MapControls() {
  const { viewMode, theme, layers, setViewMode, setTheme, toggleLayer } = useMapStore();
  const [layersOpen, setLayersOpen] = React.useState(false);

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      {/* 2D / 3D Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
        <button
          onClick={() => setViewMode('2d')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
            viewMode === '2d'
              ? 'bg-primary text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          )}
        >
          <MapIcon className="h-3.5 w-3.5" />
          2D
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
            viewMode === '3d'
              ? 'bg-primary text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          )}
        >
          <Box className="h-3.5 w-3.5" />
          3D
        </button>
      </div>

      {/* Theme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white dark:bg-gray-900 shadow-md text-xs capitalize"
          >
            🎨 {theme.replace('_', ' ')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {themeOptions.map((t) => (
            <DropdownMenuItem
              key={t}
              onClick={() => setTheme(t)}
              className={cn('capitalize', theme === t && 'text-primary font-medium')}
            >
              {t.replace('_', ' ')}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Layer Toggles */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-900 shadow-md text-xs"
          onClick={() => setLayersOpen(!layersOpen)}
        >
          <Layers className="h-3.5 w-3.5 mr-1.5" />
          Layers
        </Button>

        {layersOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg animate-scaleIn">
            <div className="flex flex-col gap-3">
              {layerOptions.map((layer) => (
                <label
                  key={layer.key}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span>{layer.emoji}</span>
                    {layer.label}
                  </span>
                  <Switch
                    checked={layers[layer.key] ?? false}
                    onCheckedChange={() => toggleLayer(layer.key)}
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
