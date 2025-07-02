import {BadRequestException, ConflictException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {CreateUrlDto} from './dto/create-url.dto';
import {generateSlug, isValidSlug} from '@/common/utils/slug.util';
import {GUEST_USER_ID} from '@/common/utils/user.util';
import {UrlRepository} from '@/modules/url/url.repository';
import {ConfigService} from '@nestjs/config';
import {UrlListResponseDto, UrlResponseDto} from '@/modules/url/dto/url-response.dto';
import {UrlRow} from '@/modules/database/types';
import {PrismaService} from '@/modules/database/prisma.service';
import {isEmpty} from 'lodash';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);
  private readonly appUrl: string;

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
  }

  async createShortUrl(createUrlDto: CreateUrlDto, userId?: string): Promise<UrlResponseDto> {
    const {originalUrl} = createUrlDto;

    return await this.prisma.transaction<UrlResponseDto>(async tx => {
      const existingUrl = await this.urlRepository.existsByOriginalUrl(originalUrl, tx);
      if (existingUrl) {
        throw new ConflictException(`This Url '${originalUrl.slice(0, 16) + '...'}' is already shortened`);
      }

      const slug = generateSlug();

      const urlRecord: UrlRow = await this.urlRepository.createShortUrl(
        {
          originalUrl,
          slug,
          userId: userId || null
        },
        tx
      );

      this.logger.log(`Created short URL: ${slug} -> ${originalUrl} for user: ${userId || 'guest'}`);

      return this.mapToResponseDto(urlRecord);
    });
  }

  async updateSlug(oldSlug: string, newSlug: string): Promise<UrlResponseDto> {
    return await this.prisma.transaction<UrlResponseDto>(async tx => {
      if (!isValidSlug(oldSlug)) {
        throw new BadRequestException('Invalid old slug format');
      }

      if (!isValidSlug(newSlug)) {
        throw new BadRequestException('Invalid new slug format');
      }

      if (oldSlug === newSlug) {
        throw new BadRequestException('New slug must be different from the current slug');
      }

      const existingUrl = await this.urlRepository.findBySlug(oldSlug, tx);
      if (!existingUrl) {
        throw new NotFoundException(`URL with slug '${oldSlug}' not found`);
      }

      const slugTaken = await this.urlRepository.existsBySlug(newSlug, tx);
      if (slugTaken) {
        throw new ConflictException(`Slug '${newSlug}' is already taken`);
      }

      const updatedUrl = await this.urlRepository.updateSlug({oldSlug, newSlug}, tx);

      if (!updatedUrl) {
        throw new NotFoundException(`URL with slug '${oldSlug}' not found`);
      }

      this.logger.log(`Updated slug: ${oldSlug} -> ${newSlug}`);

      return this.mapToResponseDto(updatedUrl);
    });
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

  async getUserUrls(userId: string): Promise<UrlListResponseDto> {
    const isGuest = userId === GUEST_USER_ID;
    const [urls, total] = await Promise.all([
      isGuest ? this.urlRepository.findUrlsByUserId(null) : this.urlRepository.findUrlsByUserId(userId),
      isGuest ? this.urlRepository.countByUserId(null) : this.urlRepository.countByUserId(userId)
    ]);

    const urlDtos = urls.map(url => this.mapToResponseDto(url));

    return {
      urls: urlDtos,
      total
    };
  }

  private mapToResponseDto(urlRecord: UrlRow): UrlResponseDto {
    return {
      id: urlRecord.id,
      slug: urlRecord.slug,
      originalUrl: urlRecord.original_url,
      shortUrl: `${this.appUrl}/${urlRecord.slug}`,
      userId: urlRecord.user_id,
      createdAt: urlRecord.created_at,
      updatedAt: urlRecord.updated_at,
      clicks: urlRecord.clicks || 0
    };
  }
}
