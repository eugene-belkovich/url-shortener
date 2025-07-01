import {ConflictException, Injectable, Logger} from '@nestjs/common';
import {CreateUrlDto} from './dto/create-url.dto';
import {generateSlug} from '@/common/utils/slug.util';
import {UrlRepository} from '@/modules/url/url.repository';
import {ConfigService} from '@nestjs/config';
import {UrlListResponseDto, UrlResponseDto} from '@/modules/url/dto/url-response.dto';

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

  async createShortUrl(createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    const {originalUrl} = createUrlDto;

    const existingUrl = await this.urlRepository.existsByOriginalUrl(originalUrl);
    if (existingUrl) {
      throw new ConflictException(`OriginalUrl '${originalUrl}' is already processed`);
    }

    const slug = generateSlug();

    try {
      const urlRecord = await this.urlRepository.create({
        originalUrl,
        slug
      });

      this.logger.log(`Created short URL: ${slug} -> ${originalUrl}`);

      return this.mapToResponseDto(urlRecord);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create URL: ${message}`, error);
      throw error;
    }
  }

  async getAllUrls(): Promise<UrlListResponseDto> {
    const [urls, total] = await Promise.all([this.urlRepository.findAll(), this.urlRepository.count()]);

    const urlDtos = urls.map(url => this.mapToResponseDto(url));

    return {
      urls: urlDtos,
      total
    };
  }

  private mapToResponseDto(urlRecord: any): UrlResponseDto {
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
