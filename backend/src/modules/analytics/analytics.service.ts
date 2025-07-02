import {Injectable, Logger} from '@nestjs/common';
import {AnalyticsRepository} from './analytics.repository';
import {TrackEventDto} from './dto/analytics-response.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async track(event: TrackEventDto): Promise<void> {
    try {
      await this.analyticsRepository.track({
        urlId: event.urlId,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        visitedAt: event.visitedAt,
        originalUrl: event.originalUrl,
        slug: event.slug
      });
    } catch (error: any) {
      this.logger.error(`Failed to record visit: ${error.message}`, error);
      throw error;
    }
  }
}
