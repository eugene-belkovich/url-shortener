export interface UrlRow {
  id: string;
  original_url: string;
  slug: string;
  user_id?: string | null;
  created_at: Date;
  updated_at: Date;
  clicks?: number;
}

export interface CreateUrlParams {
  originalUrl: string;
  slug: string;
  userId?: string | null;
}

export interface TrackEventRow {
  id: string;
  url_id: string | null;
  ip_address?: string;
  user_agent?: string;
  visited_at: Date;
  original_url: string;
  slug: string;
}

export interface TrackEventParams {
  urlId: string | null;
  ipAddress?: string;
  userAgent?: string;
  visitedAt: Date;
  originalUrl: string;
  slug: string;
}

export interface UserRow {
  id: string;
  email: string;
  password: string;
  username?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserParams {
  email: string;
  password: string;
  username?: string;
}

export interface SelectPlaceholder {
  '1': number;
}
