import {API_ENDPOINTS, STORAGE_KEYS} from '@/lib/constants'
import {AuthResponse, SignInRequest, SignUpRequest, User} from '@/types/api'
import {apiClient} from '@/lib/api'

export class AuthService {
  static async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data)
    this.storeToken(response.data.accessToken)
    this.storeUser(response.data.user)

    return response.data
  }

  static async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNIN, data)

    this.storeToken(response.data.accessToken)
    this.storeUser(response.data.user)

    return response.data
  }

  static async logout(): Promise<void> {
    this.clearAuth()
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
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
