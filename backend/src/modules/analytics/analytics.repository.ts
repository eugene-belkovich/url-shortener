import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '@/modules/database/prisma.service';
import {TrackEventParams, TrackEventRow} from '@/modules/database/types';

@Injectable()
export class AnalyticsRepository {
  private readonly logger = new Logger(AnalyticsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async track(params: TrackEventParams): Promise<TrackEventRow> {
    try {
      const result: TrackEventRow[] = await this.prisma.$queryRaw`
      INSERT INTO analytics (id, url_id, ip_address, user_agent, visited_at, original_url, slug)
      VALUES (
          gen_random_uuid(),
          ${params.urlId}, 
          ${params.ipAddress}, 
          ${params.userAgent}, 
          NOW(), 
          ${params.originalUrl}, 
          ${params.slug})
      RETURNING
           url_id, 
           ip_address, 
           user_agent, 
           visited_at, 
           original_url, 
           slug
    `;

      if (result.length === 0) {
        throw new Error('Failed to record track event');
      }

      this.logger.log(`Recorded track event for URL ID: ${params.urlId}`);
      return result[0];
    } catch (error: any) {
      this.logger.error(`Failed to record track event: ${error.message}`, error);
      throw error;
    }
  }
}
