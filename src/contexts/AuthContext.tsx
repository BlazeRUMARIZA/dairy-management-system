import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'

interface User {
  id: string | number
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching current user
          const response = await api.auth.getCurrentUser()
          if (response.success) {
            const userData: User = {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role,
              avatar: response.data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.name)}&background=4A90E2&color=fff`
            }
            setUser(userData)
          } else {
            // Token expired or invalid
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password)
      
      if (response.success && response.user) {
        // Format user data to match our interface
        const userData: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          avatar: response.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}&background=4A90E2&color=fff`
        }
        
        setUser(userData)
        // Token is already saved by api.auth.login()
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    api.auth.logout() // This clears token, user, and redirects
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

