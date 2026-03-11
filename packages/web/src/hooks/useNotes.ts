import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useNotes(tripId?: string) {
  return useQuery({
    queryKey: ['notes', tripId],
    queryFn: () =>
      api.get('/notes', { params: { tripId } }).then((r) => r.data.data),
    enabled: !!tripId,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', 'detail', id],
    queryFn: () => api.get(`/notes/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/notes', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      api.patch(`/notes/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/notes/${id}`).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}
