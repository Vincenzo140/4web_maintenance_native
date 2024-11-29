import { create } from 'zustand';
import { AuthToken } from '../types';

interface AuthState {
  token: AuthToken | null;
  username: string | null;
  setToken: (token: AuthToken) => void;
  setUsername: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: localStorage.getItem('username') || null, // Recuperar do localStorage
  setToken: (token) => set({ token }),
  setUsername: (username) => {
    localStorage.setItem('username', username); // Salvar também no localStorage
    set({ username });
  },
  logout: () => {
    localStorage.removeItem('username');
    localStorage.removeItem('auth_token');
    set({ token: null, username: null });
  },
}));
