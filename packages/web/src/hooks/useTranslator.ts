import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export function useTranslate() {
  return useMutation({
    mutationFn: (data: { text: string; from?: string; to: string }) =>
      api.post('/translator/translate', data).then((r) => r.data.data),
  });
}

export function useDetectLanguage() {
  return useMutation({
    mutationFn: (text: string) =>
      api.post('/translator/detect', { text }).then((r) => r.data.data),
  });
}

export function useSupportedLanguages() {
  return useQuery({
    queryKey: ['translator', 'languages'],
    queryFn: () => api.get('/translator/languages').then((r) => r.data.data),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function usePhrasebook(language?: string) {
  return useQuery({
    queryKey: ['translator', 'phrasebook', language],
    queryFn: () =>
      api.get('/translator/phrasebook', { params: { language } }).then((r) => r.data.data),
    enabled: !!language,
  });
}
