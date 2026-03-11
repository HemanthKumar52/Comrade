import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCurrentWeather(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['weather', 'current', lat, lng],
    queryFn: () =>
      api.get('/weather/current', { params: { lat, lng } }).then((r) => r.data.data),
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 10 * 60 * 1000,
  });
}

export function useForecast(lat?: number, lng?: number, days = 5) {
  return useQuery({
    queryKey: ['weather', 'forecast', lat, lng, days],
    queryFn: () =>
      api.get('/weather/forecast', { params: { lat, lng, days } }).then((r) => r.data.data),
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 30 * 60 * 1000,
  });
}

export function useWeatherAlerts(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['weather', 'alerts', lat, lng],
    queryFn: () =>
      api.get('/weather/alerts', { params: { lat, lng } }).then((r) => r.data.data),
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 15 * 60 * 1000,
  });
}

export function useRouteWeather(routeId?: string) {
  return useQuery({
    queryKey: ['weather', 'route', routeId],
    queryFn: () =>
      api.get(`/weather/route/${routeId}`).then((r) => r.data.data),
    enabled: !!routeId,
    staleTime: 15 * 60 * 1000,
  });
}

export function useBestTimeToVisit(country?: string) {
  return useQuery({
    queryKey: ['weather', 'best-time', country],
    queryFn: () =>
      api.get(`/weather/best-time/${country}`).then((r) => r.data.data),
    enabled: !!country,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
