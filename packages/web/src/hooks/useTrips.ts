import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useTrips(status?: string) {
  return useQuery({
    queryKey: ['trips', status],
    queryFn: () => api.get('/trips', { params: { status } }).then((r) => r.data.data),
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => api.get(`/trips/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/trips', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      api.patch(`/trips/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}

export function useStartTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/trips/${id}/start`).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}

export function useEndTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/trips/${id}/end`).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}
