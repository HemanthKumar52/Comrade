import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useTrafficRules(country?: string) {
  return useQuery({
    queryKey: ['traffic', 'rules', country],
    queryFn: () => api.get(`/traffic/rules/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useSpeedLimits(country?: string) {
  return useQuery({
    queryKey: ['traffic', 'speed-limits', country],
    queryFn: () => api.get(`/traffic/speed-limits/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useDrivingLicense(country?: string) {
  return useQuery({
    queryKey: ['traffic', 'license', country],
    queryFn: () => api.get(`/traffic/license/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useTrafficFines(country?: string) {
  return useQuery({
    queryKey: ['traffic', 'fines', country],
    queryFn: () => api.get(`/traffic/fines/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
