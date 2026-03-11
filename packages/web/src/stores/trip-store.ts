import { create } from 'zustand';

interface TripState {
  activeTrip: any | null;
  members: any[];
  isTracking: boolean;
  setActiveTrip: (trip: any) => void;
  setMembers: (members: any[]) => void;
  setTracking: (tracking: boolean) => void;
  clearTrip: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  activeTrip: null,
  members: [],
  isTracking: false,
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  setMembers: (members) => set({ members }),
  setTracking: (tracking) => set({ isTracking: tracking }),
  clearTrip: () => set({ activeTrip: null, members: [], isTracking: false }),
}));
