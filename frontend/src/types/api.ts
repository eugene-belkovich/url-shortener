export interface Url {
  id: string
  originalUrl: string
  slug: string
  shortUrl: string
  clickCount: number
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
