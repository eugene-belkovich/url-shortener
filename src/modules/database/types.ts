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

export interface SelectPlaceholder {
  '1': number;
}
