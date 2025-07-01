import {Injectable, Logger} from '@nestjs/common';
import {CreateUrlDto} from './dto/create-url.dto';
import {UpdateUrlDto} from './dto/update-url.dto';
import {generateSlug} from '@/common/utils/slug.util';
import {UrlRepository} from '@/modules/url/url.repository';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);
  private readonly appUrl: string;

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly configService: ConfigService
  ) {
    this.appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
  }

  async createShortUrl(createUrlDto: CreateUrlDto): Promise<any> {
    const {originalUrl} = createUrlDto;

    const slug = generateSlug();

    try {
      const urlRecord = await this.urlRepository.create({
        originalUrl,
        slug
      });

      this.logger.log(`Created short URL: ${slug} -> ${originalUrl}`);

      return this.mapToResponseDto(urlRecord);
    } catch (error) {
      this.logger.error(`Failed to create URL: ${error.message}`, error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all url`;
  }

  findOne(id: number) {
    return `This action returns a #${id} url`;
  }

  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }

  private mapToResponseDto(urlRecord: any): any {
    return {
      slug: urlRecord.slug,
      originalUrl: urlRecord.original_url || urlRecord.originalUrl,
      shortUrl: `${this.appUrl}/${urlRecord.slug}`,
      createdAt: urlRecord.created_at || urlRecord.createdAt,
      updatedAt: urlRecord.updated_at || urlRecord.updatedAt,
      visits: urlRecord.visit_count || urlRecord.visits,
      lastVisited: urlRecord.last_visited || urlRecord.lastVisited
    };
  }
}
