import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useSafetyScore(country?: string) {
  return useQuery({
    queryKey: ['safety', 'score', country],
    queryFn: () => api.get(`/safety/score/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useSafetyCategories(country?: string) {
  return useQuery({
    queryKey: ['safety', 'categories', country],
    queryFn: () => api.get(`/safety/categories/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useSafetyComparison(countries: string[]) {
  return useQuery({
    queryKey: ['safety', 'compare', ...countries],
    queryFn: () =>
      api.get('/safety/compare', { params: { countries: countries.join(',') } }).then((r) => r.data.data),
    enabled: countries.length >= 2,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useCommonScams(country?: string) {
  return useQuery({
    queryKey: ['safety', 'scams', country],
    queryFn: () => api.get(`/safety/scams/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
