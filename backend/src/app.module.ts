import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {UrlModule} from './modules/url/url.module';
import {DatabaseModule} from '@/modules/database/database.module';
import {RedirectModule} from '@/modules/redirect/redirect.module';
import {AnalyticsModule} from '@/modules/analytics/analytics.module';
import {AuthModule} from '@/modules/auth/auth.module';
import {ThrottlerModule} from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'] //todo add .env.prod later
    }),
    DatabaseModule,
    UrlModule,
    RedirectModule,
    AnalyticsModule,
    AuthModule
  ]
})
export class AppModule {}
