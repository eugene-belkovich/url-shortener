import {BadRequestException, ConflictException, Injectable, Logger} from '@nestjs/common';
import {CreateUrlDto} from './dto/create-url.dto';
import {generateSlug, isValidSlug} from '@/common/utils/slug.util';
import {UrlRepository} from '@/modules/url/url.repository';
import {ConfigService} from '@nestjs/config';
import {UrlListResponseDto, UrlResponseDto} from '@/modules/url/dto/url-response.dto';
import {UrlRow} from '@/modules/database/types';

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
      const urlRecord: UrlRow = await this.urlRepository.create({
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

  async getUrlBySlug(slug: string): Promise<UrlResponseDto | null> {
    if (!isValidSlug(slug)) {
      throw new BadRequestException('Invalid slug format');
    }

    const urlRecord = await this.urlRepository.findBySlug(slug);

    if (!urlRecord) {
      return null;
    }

    return this.mapToResponseDto(urlRecord);
  }

  async getAllUrls(): Promise<UrlListResponseDto> {
    const [urls, total] = await Promise.all([this.urlRepository.findAll(), this.urlRepository.count()]);

    const urlDtos = urls.map(url => this.mapToResponseDto(url));

    return {
      urls: urlDtos,
      total
    };
  }

  private mapToResponseDto(urlRecord: UrlRow): UrlResponseDto {
    return {
      slug: urlRecord.slug,
      originalUrl: urlRecord.original_url,
      shortUrl: `${this.appUrl}/${urlRecord.slug}`,
      createdAt: urlRecord.created_at,
      updatedAt: urlRecord.updated_at
    };
  }
}
