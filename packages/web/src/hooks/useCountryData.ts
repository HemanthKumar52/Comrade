import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCountryInfo(code?: string) {
  return useQuery({
    queryKey: ['country', 'info', code],
    queryFn: () =>
      api.get(`/travel-kit/countries/${code}`).then((r) => r.data.data),
    enabled: !!code,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCountryList() {
  return useQuery({
    queryKey: ['country', 'list'],
    queryFn: () =>
      api.get('/travel-kit/countries').then((r) => r.data.data),
    staleTime: 60 * 60 * 1000,
  });
}

export function useEmergencyNumbers(country?: string) {
  return useQuery({
    queryKey: ['emergency', 'numbers', country],
    queryFn: () =>
      api.get(`/emergency/numbers/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 30 * 60 * 1000,
  });
}

export function useTimezoneComparison(from?: string, to?: string) {
  return useQuery({
    queryKey: ['timezone', 'compare', from, to],
    queryFn: () =>
      api.get('/travel-kit/timezone/compare', { params: { from, to } }).then((r) => r.data.data),
    enabled: !!from && !!to,
  });
}

export function useVisaRequirement(passport?: string, destination?: string) {
  return useQuery({
    queryKey: ['visa', passport, destination],
    queryFn: () =>
      api.get('/travel-kit/visa', { params: { passport, destination } }).then((r) => r.data.data),
    enabled: !!passport && !!destination,
    staleTime: 60 * 60 * 1000,
  });
}

export function useLocalLaws(country?: string) {
  return useQuery({
    queryKey: ['laws', country],
    queryFn: () =>
      api.get(`/travel-kit/laws/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCommonPrices(country?: string) {
  return useQuery({
    queryKey: ['prices', country],
    queryFn: () =>
      api.get(`/travel-kit/prices/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 15 * 60 * 1000,
  });
}
