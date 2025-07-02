import {apiClient} from '@/lib/api'
import {API_ENDPOINTS} from '@/lib/constants'
import {CreateUrlResponse, UrlListResponse, CreateUrlRequest} from '@/types/api'

export class UrlService {
  static async createUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    const response = await apiClient.post<CreateUrlResponse>(API_ENDPOINTS.URLS.CREATE, data)
    return response.data
  }

  static async getUrls(): Promise<UrlListResponse> {
    const response = await apiClient.get<UrlListResponse>(API_ENDPOINTS.URLS.LIST)
    return response.data
  }

  static async getUserUrls(userId?: string): Promise<UrlListResponse> {
    const params = userId ? {userId} : {}
    const response = await apiClient.get<UrlListResponse>(API_ENDPOINTS.URLS.USER, {params})
    return response.data
  }

  static async updateSlug(slug: string, newSlug: string): Promise<CreateUrlResponse> {
    const response = await apiClient.put<CreateUrlResponse>(`${API_ENDPOINTS.URLS.LIST}/${slug}`, {newSlug})
    return response.data
  }
}
