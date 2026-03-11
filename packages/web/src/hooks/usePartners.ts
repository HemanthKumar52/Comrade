import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePartners(params?: { search?: string; level?: string }) {
  return useQuery({
    queryKey: ['partners', params],
    queryFn: () => api.get('/partners', { params }).then((r) => r.data.data),
  });
}

export function usePartner(id: string) {
  return useQuery({
    queryKey: ['partners', id],
    queryFn: () => api.get(`/partners/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useSendPartnerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.post('/partners/request', { userId }).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partners'] }),
  });
}

export function useRespondPartnerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) =>
      api.post(`/partners/request/${requestId}/${action}`).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partners'] }),
  });
}

export function usePartnerRequests() {
  return useQuery({
    queryKey: ['partners', 'requests'],
    queryFn: () => api.get('/partners/requests').then((r) => r.data.data),
  });
}
