export const API_ENDPOINTS = {
  URLS: {
    CREATE: '/urls',
    LIST: '/urls',
    USER: '/urls/user',
  },
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
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

export const GUEST_USER_ID = 'guest' as const
