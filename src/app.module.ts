import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UrlModule} from './modules/url/url.module';
import {DatabaseModule} from '@/modules/database/database.module';
import {RedirectModule} from '@/modules/redirect/redirect.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'] //todo add .env.prod later
    }),
    DatabaseModule,
    UrlModule,
    RedirectModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
