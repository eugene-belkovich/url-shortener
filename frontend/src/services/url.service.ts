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

  static async updateSlug(id: string, newSlug: string): Promise<CreateUrlResponse> {
    const response = await apiClient.put<CreateUrlResponse>(`${API_ENDPOINTS.URLS.LIST}/${id}`, {newSlug})
    return response.data
  }
}
