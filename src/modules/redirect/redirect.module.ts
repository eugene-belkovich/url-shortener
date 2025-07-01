import {Module} from '@nestjs/common';
import {RedirectController} from './redirect.controller';
import {UrlModule} from '@/modules/url/url.module';
import {AnalyticsModule} from '@/modules/analytics/analytics.module';

@Module({
  imports: [UrlModule, AnalyticsModule],
  controllers: [RedirectController]
})
export class RedirectModule {}
