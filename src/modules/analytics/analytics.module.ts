import {Module} from '@nestjs/common';
import {AnalyticsService} from './analytics.service';
import {AnalyticsRepository} from './analytics.repository';

@Module({
  imports: [],
  providers: [AnalyticsService, AnalyticsRepository],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}
