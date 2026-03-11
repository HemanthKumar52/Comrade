import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/badges').then((r) => r.data.data),
  });
}

export function useMyBadges() {
  return useQuery({
    queryKey: ['badges', 'mine'],
    queryFn: () => api.get('/badges/mine').then((r) => r.data.data),
  });
}

export function useLeaderboard(period?: string) {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () =>
      api.get('/badges/leaderboard', { params: { period } }).then((r) => r.data.data),
  });
}
