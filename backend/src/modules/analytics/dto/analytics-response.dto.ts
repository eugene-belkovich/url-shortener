export interface TrackEventDto {
  urlId: string | null;
  ipAddress?: string;
  userAgent?: string;
  visitedAt: Date;
  originalUrl: string;
  slug: string;
}
