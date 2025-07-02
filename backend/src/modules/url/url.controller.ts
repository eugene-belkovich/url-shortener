import {Controller, Get, Post, Body, Logger, Param, Put, UseGuards, Query} from '@nestjs/common';

import {UrlService} from './url.service';
import {CreateUrlDto} from './dto/create-url.dto';
import {UrlListResponseDto, UrlResponseDto} from '@/modules/url/dto/url-response.dto';
import {UpdateSlugParams} from '@/modules/url/dto/update-slug.param';
import {UpdateSlugDto} from '@/modules/url/dto/update-slug.dto';
import {JwtAuthGuard} from '@/modules/auth/guards/jwt-auth.guard';
import {OptionalJwtAuthGuard} from '@/modules/auth/guards/optional-jwt-auth.guard';
import {CurrentUser} from '@/modules/auth/decorators/current-user.decorator';
import {UserResponseDto} from '@/modules/auth/dto/auth-response.dto';
import {GUEST_USER_ID} from '@/common/utils/user.util';

@Controller('urls')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async createShortUrl(
    @Body() createUrlDto: CreateUrlDto,
    @CurrentUser() user?: UserResponseDto
  ): Promise<UrlResponseDto> {
    this.logger.log(`Creating short URL for: ${createUrlDto.originalUrl} by user: ${user?.email || 'guest'}`);
    return await this.urlService.createShortUrl(createUrlDto, user?.id);
  }

  @Put(':oldSlug')
  @UseGuards(JwtAuthGuard)
  async updateSlug(@Param() param: UpdateSlugParams, @Body() updateSlugDto: UpdateSlugDto): Promise<UrlResponseDto> {
    this.logger.log(`Updating slug: ${param.oldSlug} -> ${updateSlugDto.newSlug}`);
    return await this.urlService.updateSlug(param.oldSlug, updateSlugDto.newSlug);
  }

  @Get()
  async getAllUrls(): Promise<UrlListResponseDto> {
    this.logger.log(`Getting URLs list`);
    return await this.urlService.getAllUrls();
  }

  @Get('user')
  async getUserUrls(
    @Query('userId') userId: string,
    @CurrentUser() user?: UserResponseDto
  ): Promise<UrlListResponseDto> {
    const targetUserId = userId || user?.id || GUEST_USER_ID;
    this.logger.log(`Getting URLs for user: ${targetUserId}`);
    return await this.urlService.getUserUrls(targetUserId);
  }
}
