import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
  credits: number
  karma: number
  isIdVerified: boolean
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false 
        })
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('skillswap-user', JSON.stringify(data.user))
        }
        return { success: true }
      } else {
        set({ isLoading: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      set({ isLoading: false })
      return { success: false, error: 'Network error' }
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false 
        })
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('skillswap-user', JSON.stringify(data.user))
        }
        return { success: true }
      } else {
        set({ isLoading: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      set({ isLoading: false })
      return { success: false, error: 'Network error' }
    }
  },

  signOut: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    })
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillswap-user')
    }
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData }
      set({ 
        user: updatedUser 
      })
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillswap-user', JSON.stringify(updatedUser))
      }
    }
  },
}))

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('skillswap-user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      useAuthStore.setState({ 
        user, 
        isAuthenticated: true 
      })
    } catch (error) {
      console.error('Failed to parse stored user data:', error)
      localStorage.removeItem('skillswap-user')
    }
  }
}