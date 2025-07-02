export interface Url {
  id: string
  originalUrl: string
  slug: string
  shortUrl: string
  clicks: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface UrlListResponse {
  urls: Url[]
  total: number
}

export interface CreateUrlRequest {
  originalUrl: string
  customSlug?: string
}

export type CreateUrlResponse = Url

export interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}
