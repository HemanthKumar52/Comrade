import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useVehicleRentals(country?: string, type?: string) {
  return useQuery({
    queryKey: ['vehicles', 'rentals', country, type],
    queryFn: () =>
      api.get('/vehicles/rentals', { params: { country, type } }).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 30 * 60 * 1000,
  });
}

export function usePriceEstimate(country?: string, type?: string, days?: number) {
  return useQuery({
    queryKey: ['vehicles', 'estimate', country, type, days],
    queryFn: () =>
      api.get('/vehicles/estimate', { params: { country, type, days } }).then((r) => r.data.data),
    enabled: !!country && !!type && !!days,
    staleTime: 15 * 60 * 1000,
  });
}

export function useVehicleProviders(country?: string) {
  return useQuery({
    queryKey: ['vehicles', 'providers', country],
    queryFn: () =>
      api.get('/vehicles/providers', { params: { country } }).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 30 * 60 * 1000,
  });
}
