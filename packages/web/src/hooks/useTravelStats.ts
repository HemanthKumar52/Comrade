import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useTravelStats() {
  return useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: () => api.get('/stats/overview').then((r) => r.data.data),
    staleTime: 30 * 60 * 1000,
  });
}

export function useActivityHeatmap(year?: number) {
  return useQuery({
    queryKey: ['stats', 'heatmap', year],
    queryFn: () =>
      api.get('/stats/heatmap', { params: { year } }).then((r) => r.data.data),
    enabled: !!year,
    staleTime: 60 * 60 * 1000,
  });
}

export function useMonthlyTrips(year?: number) {
  return useQuery({
    queryKey: ['stats', 'monthly', year],
    queryFn: () =>
      api.get('/stats/monthly', { params: { year } }).then((r) => r.data.data),
    enabled: !!year,
    staleTime: 60 * 60 * 1000,
  });
}

export function useVehicleUsage() {
  return useQuery({
    queryKey: ['stats', 'vehicles'],
    queryFn: () => api.get('/stats/vehicles').then((r) => r.data.data),
    staleTime: 60 * 60 * 1000,
  });
}

export function useFunFacts() {
  return useQuery({
    queryKey: ['stats', 'fun-facts'],
    queryFn: () => api.get('/stats/fun-facts').then((r) => r.data.data),
    staleTime: 60 * 60 * 1000,
  });
}

export function useTravelWrapped(year?: number) {
  return useQuery({
    queryKey: ['stats', 'wrapped', year],
    queryFn: () => api.get(`/stats/wrapped/${year}`).then((r) => r.data.data),
    enabled: !!year,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
