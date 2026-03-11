import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePhrases(language?: string, category?: string) {
  return useQuery({
    queryKey: ['phrases', language, category],
    queryFn: () =>
      api.get('/phrases', { params: { language, category } }).then((r) => r.data.data),
    enabled: !!language,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useEssentialPhrases(language?: string) {
  return useQuery({
    queryKey: ['phrases', 'essential', language],
    queryFn: () =>
      api.get(`/phrases/essential/${language}`).then((r) => r.data.data),
    enabled: !!language,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function usePhraseSearch(language?: string, query?: string) {
  return useQuery({
    queryKey: ['phrases', 'search', language, query],
    queryFn: () =>
      api.get('/phrases/search', { params: { language, q: query } }).then((r) => r.data.data),
    enabled: !!language && !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLanguagePack(language?: string) {
  return useQuery({
    queryKey: ['phrases', 'pack', language],
    queryFn: () =>
      api.get(`/phrases/pack/${language}`).then((r) => r.data.data),
    enabled: !!language,
    staleTime: 60 * 60 * 1000,
  });
}
