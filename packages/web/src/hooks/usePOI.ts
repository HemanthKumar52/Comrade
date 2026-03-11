import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePOIs(params?: { lat?: number; lng?: number; radius?: number; category?: string }) {
  return useQuery({
    queryKey: ['pois', params],
    queryFn: () => api.get('/pois', { params }).then((r) => r.data.data),
    enabled: !!(params?.lat && params?.lng),
  });
}

export function usePOI(id: string) {
  return useQuery({
    queryKey: ['pois', id],
    queryFn: () => api.get(`/pois/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreatePOI() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/pois', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pois'] }),
  });
}

export function usePOIReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      api.post(`/pois/${id}/reviews`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pois'] }),
  });
}
