import { create } from 'zustand';
import { AuthToken } from '../types';

interface AuthState {
  token: AuthToken | null;
  setToken: (token: AuthToken) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  logout: () => set({ token: null }),
}));