'use client';
import * as React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_THEMES, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/map';
import { cn } from '@/lib/utils';

interface MapMarker {
  id: string;
  lng: number;
  lat: number;
  color?: string;
  label?: string;
  icon?: string;
}

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  theme?: keyof typeof MAP_THEMES;
  markers?: MapMarker[];
  className?: string;
  onMapReady?: (map: maplibregl.Map) => void;
  onClick?: (lngLat: { lng: number; lat: number }) => void;
}

export function MapContainer({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  theme = 'daylight',
  markers = [],
  className,
  onMapReady,
  onClick,
}: MapContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<maplibregl.Marker[]>([]);

  // Initialize map
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_THEMES[theme] || MAP_THEMES.daylight,
      center: [center[0], center[1]],
      zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.GeolocateControl({ trackUserLocation: true }), 'top-right');

    if (onClick) {
      map.on('click', (e) => {
        onClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      });
    }

    map.on('load', () => {
      onMapReady?.(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style when theme changes
  React.useEffect(() => {
    if (!mapRef.current) return;
    const styleUrl = MAP_THEMES[theme] || MAP_THEMES.daylight;
    mapRef.current.setStyle(styleUrl);
  }, [theme]);

  // Update center/zoom
  React.useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [center[0], center[1]], zoom });
  }, [center, zoom]);

  // Render markers
  React.useEffect(() => {
    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!mapRef.current) return;

    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'partner-map-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = marker.color || '#E8733A';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '14px';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';

      if (marker.label) {
        el.textContent = marker.label.charAt(0).toUpperCase();
      }

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .addTo(mapRef.current!);

      if (marker.label) {
        m.setPopup(
          new maplibregl.Popup({ offset: 20 }).setHTML(
            `<div style="padding:4px 8px;font-size:13px;font-weight:500">${marker.label}</div>`
          )
        );
      }

      markersRef.current.push(m);
    });
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={cn('w-full h-full min-h-[400px] rounded-xl overflow-hidden', className)}
    />
  );
}
