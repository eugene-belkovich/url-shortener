import {STORAGE_KEYS} from '@/lib/constants'
import {AuthResponse, SignInRequest, SignUpRequest, User} from '@/types/api'

export class AuthService {
  static async signIn(data: SignInRequest): Promise<AuthResponse> {
    const mockResponse: AuthResponse = {
      user: {
        id: '1',
        email: data.email,
        username: data.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: 'mock_access_token_' + Date.now(),
    }

    this.storeToken(mockResponse.accessToken)
    this.storeUser(mockResponse.user)

    return mockResponse
  }

  static async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const mockResponse: AuthResponse = {
      user: {
        id: '1',
        email: data.email,
        username: data.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: 'mock_access_token_' + Date.now(),
    }

    this.storeToken(mockResponse.accessToken)
    this.storeUser(mockResponse.user)

    return mockResponse
  }

  static async logout(): Promise<void> {
    this.clearAuth()
  }

  static async getProfile(): Promise<User> {
    const storedUser = this.getStoredUser()
    if (!storedUser) {
      throw new Error('No user found')
    }

    return storedUser
  }

  static storeToken(accessToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    }
    return null
  }

  static storeUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    }
  }

  static getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(STORAGE_KEYS.USER)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  static clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}
