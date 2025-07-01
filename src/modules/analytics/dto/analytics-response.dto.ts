export interface TrackEventDto {
  id: string;
  urlId: string;
  ipAddress?: string;
  userAgent?: string;
  visitedAt: Date;
  originalUrl: string;
  slug: string;
}
