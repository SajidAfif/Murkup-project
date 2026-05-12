import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setUser: (user) => set({ user }),
      initializeAuth: () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token && user) {
          set({ token, user: JSON.parse(user) })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
