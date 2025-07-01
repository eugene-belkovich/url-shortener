import {Module} from '@nestjs/common';
import {UrlService} from './url.service';
import {UrlController} from './url.controller';
import {UrlRepository} from './url.repository';
import {DatabaseModule} from '@/modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository]
})
export class UrlModule {}
