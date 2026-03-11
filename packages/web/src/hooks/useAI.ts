import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export function useGenerateStory() {
  return useMutation({
    mutationFn: (tripId: string) =>
      api.post(`/ai/generate-story`, { tripId }).then((r) => r.data.data),
  });
}

export function useMoodRoutes(mood?: string, city?: string) {
  return useQuery({
    queryKey: ['ai', 'mood-routes', mood, city],
    queryFn: () =>
      api.get('/ai/mood-routes', { params: { mood, city } }).then((r) => r.data.data),
    enabled: !!mood && !!city,
    staleTime: 30 * 60 * 1000,
  });
}

export function useSmartTips(country?: string) {
  return useQuery({
    queryKey: ['ai', 'smart-tips', country],
    queryFn: () =>
      api.get(`/ai/smart-tips/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 60 * 60 * 1000,
  });
}

export function useQuickRecommendations(country?: string, category?: string) {
  return useQuery({
    queryKey: ['ai', 'recommendations', country, category],
    queryFn: () =>
      api.get('/ai/recommendations', { params: { country, category } }).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 30 * 60 * 1000,
  });
}
