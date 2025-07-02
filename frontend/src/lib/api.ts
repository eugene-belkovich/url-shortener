import axios, {AxiosInstance} from 'axios'
import {STORAGE_KEYS} from './constants'

const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use(
    config => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
        }
      }
      return Promise.reject(error)
    }
  )

  return client
}

export const apiClient = createApiClient()
