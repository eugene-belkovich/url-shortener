'use client'

import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react'
import {User, SignInRequest, SignUpRequest} from '@/types/api'
import {AuthService} from '@/services/auth.service'
import {toast} from 'sonner'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  signIn: (data: SignInRequest) => Promise<void>
  signUp: (data: SignUpRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser()
        const isAuthenticated = AuthService.isAuthenticated()

        if (isAuthenticated && storedUser) {
          setAuthState({
            user: storedUser,
            isAuthenticated: true,
            isLoading: false,
          })

          try {
            const user = await AuthService.getProfile()
            AuthService.storeUser(user)
            setAuthState(prev => ({
              ...prev,
              user,
            }))
          } catch (error) {
            console.warn('Failed to refresh user profile:', error)
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    initializeAuth()
  }, [])

  const signIn = async (data: SignInRequest): Promise<void> => {
    try {
      setAuthState(prev => ({...prev, isLoading: true}))

      const response = await AuthService.signIn(data)

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      })

      toast.success('Successfully signed in!')
    } catch (error) {
      // @ts-expect-error - backend error response structure
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to sign in'
      toast.error(errorMessage)
      setAuthState(prev => ({...prev, isLoading: false}))
      throw error
    }
  }

  const signUp = async (data: SignUpRequest): Promise<void> => {
    try {
      setAuthState(prev => ({...prev, isLoading: true}))

      const response = await AuthService.signUp(data)

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      })

      toast.success('Successfully signed up!')
    } catch (error) {
      // @ts-expect-error - backend error response structure
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to sign up'
      toast.error(errorMessage)
      setAuthState(prev => ({...prev, isLoading: false}))
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout()

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      toast.success('Successfully logout!')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to sign out')
    }
  }

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useIsAuthenticated = (): boolean => {
  const {isAuthenticated} = useAuth()
  return isAuthenticated
}

export const useCurrentUser = (): User | null => {
  const {user} = useAuth()
  return user
}
