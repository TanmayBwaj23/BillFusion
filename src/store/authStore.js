import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        role: user?.role
      }),
      
      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        role: null
      }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
      
      isClient: () => get().role === 'client',
      isVendor: () => get().role === 'vendor',
      isEmployee: () => get().role === 'employee',
      isAdmin: () => get().role === 'admin'
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        role: state.role
      })
    }
  )
);

export default useAuthStore;
