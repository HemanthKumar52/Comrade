import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCarbonStats() {
  return useQuery({
    queryKey: ['carbon', 'stats'],
    queryFn: () => api.get('/carbon/stats').then((r) => r.data.data),
    staleTime: 30 * 60 * 1000,
  });
}

export function useTripCarbon(tripId?: string) {
  return useQuery({
    queryKey: ['carbon', 'trip', tripId],
    queryFn: () => api.get(`/carbon/trip/${tripId}`).then((r) => r.data.data),
    enabled: !!tripId,
    staleTime: 15 * 60 * 1000,
  });
}

export function useCarbonComparison(vehicle1?: string, vehicle2?: string, distance?: number) {
  return useQuery({
    queryKey: ['carbon', 'compare', vehicle1, vehicle2, distance],
    queryFn: () =>
      api.get('/carbon/compare', { params: { vehicle1, vehicle2, distance } }).then((r) => r.data.data),
    enabled: !!vehicle1 && !!vehicle2 && !!distance,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCarbonLeaderboard() {
  return useQuery({
    queryKey: ['carbon', 'leaderboard'],
    queryFn: () => api.get('/carbon/leaderboard').then((r) => r.data.data),
    staleTime: 60 * 60 * 1000,
  });
}

export function useOffsetCarbon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; trees: number }) =>
      api.post('/carbon/offset', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['carbon'] }),
  });
}
