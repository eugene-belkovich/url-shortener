export const API_ENDPOINTS = {
  URLS: {
    CREATE: '/api/v1/urls',
    LIST: '/api/v1/urls',
  },
  AUTH: {
    SIGNIN: '/api/v1/auth/signin',
    SIGNUP: '/api/v1/auth/signup',
    LOGOUT: '/api/v1/auth/logout',
  },
} as const

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
} as const
