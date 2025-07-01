export interface TrackEventDto {
  urlId: string;
  ipAddress?: string;
  userAgent?: string;
  visitedAt: Date;
  originalUrl: string;
  slug: string;
}
