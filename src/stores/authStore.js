import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem('admin_token', token);
        localStorage.setItem('token', token);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token');
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
