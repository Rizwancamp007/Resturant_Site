import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data.data, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
          return data.data;
        } catch (error) {
          const msg = error.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: msg });
          throw new Error(msg);
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', { name, email, password, phone });
          set({ user: data.data, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
          return data.data;
        } catch (error) {
          const msg = error.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: msg });
          throw new Error(msg);
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, error: null });
        delete api.defaults.headers.common['Authorization'];
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return null;
        try {
          const { data } = await api.post('/auth/refresh', { refreshToken });
          set({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
          api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
          return data.data.accessToken;
        } catch {
          get().logout();
          return null;
        }
      },

      initAuth: () => {
        const { accessToken } = get();
        if (accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
      }
    }),
    { name: 'lahore-traditional-auth', partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken }) }
  )
);

export default useAuthStore;
