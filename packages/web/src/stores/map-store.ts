import { create } from 'zustand';

interface MapState {
  viewMode: '2d' | '3d';
  theme: string;
  center: [number, number];
  zoom: number;
  selectedPOI: any | null;
  layers: Record<string, boolean>;
  setViewMode: (mode: '2d' | '3d') => void;
  setTheme: (theme: string) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setSelectedPOI: (poi: any) => void;
  toggleLayer: (layer: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  viewMode: '2d',
  theme: 'daylight',
  center: [78.9629, 20.5937],
  zoom: 5,
  selectedPOI: null,
  layers: {
    hotels: true,
    restaurants: true,
    scenic: true,
    historic: true,
    petrol: false,
    atm: false,
  },
  setViewMode: (mode) => set({ viewMode: mode }),
  setTheme: (theme) => set({ theme }),
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedPOI: (poi) => set({ selectedPOI: poi }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
}));
