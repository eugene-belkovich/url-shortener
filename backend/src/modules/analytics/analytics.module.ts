import {Module} from '@nestjs/common';
import {AnalyticsService} from './analytics.service';
import {AnalyticsRepository} from './analytics.repository';
import {DatabaseModule} from '@/modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AnalyticsService, AnalyticsRepository],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}
