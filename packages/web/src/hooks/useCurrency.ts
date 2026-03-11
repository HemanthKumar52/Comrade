import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useExchangeRates(base?: string) {
  return useQuery({
    queryKey: ['currency', 'rates', base],
    queryFn: () =>
      api.get('/currency/rates', { params: { base } }).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useConvertCurrency() {
  return useMutation({
    mutationFn: (data: { amount: number; from: string; to: string }) =>
      api.post('/currency/convert', data).then((r) => r.data.data),
  });
}

export function useExpenses(tripId?: string) {
  return useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () =>
      api.get('/expenses', { params: { tripId } }).then((r) => r.data.data),
    enabled: !!tripId,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/expenses', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useExpenseSummary(tripId?: string) {
  return useQuery({
    queryKey: ['expenses', 'summary', tripId],
    queryFn: () =>
      api.get(`/expenses/summary`, { params: { tripId } }).then((r) => r.data.data),
    enabled: !!tripId,
  });
}
