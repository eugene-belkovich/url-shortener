export interface UrlRow {
  id: string;
  original_url: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUrlParams {
  originalUrl: string;
  slug: string;
}

export interface TrackEventRow {
  id: string;
  url_id: string;
  ip_address?: string;
  user_agent?: string;
  visited_at: Date;
  original_url: string;
  slug: string;
}

export interface TrackEventParams {
  urlId: bigint;
  ipAddress?: string;
  userAgent?: string;
  visitedAt: Date;
  originalUrl: string;
  slug: string;
}

export interface SelectPlaceholder {
  '1': number;
}
