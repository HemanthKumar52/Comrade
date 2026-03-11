import { create } from 'zustand';
import api from './api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: string;
  xp: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('partner_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('partner_token') : false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('partner_token', data.data.accessToken);
    localStorage.setItem('partner_refresh_token', data.data.refreshToken);
    set({
      token: data.data.accessToken,
      isAuthenticated: true,
      user: data.data.user,
      isLoading: false,
    });
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true });
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('partner_token', data.data.accessToken);
    localStorage.setItem('partner_refresh_token', data.data.refreshToken);
    set({
      token: data.data.accessToken,
      isAuthenticated: true,
      user: data.data.user,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
