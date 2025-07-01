import {Controller, Get, Post, Body, Logger, Param, Res, Req, HttpStatus, Put} from '@nestjs/common';

import {UrlService} from './url.service';
import {CreateUrlDto} from './dto/create-url.dto';
import {UrlListResponseDto, UrlResponseDto} from '@/modules/url/dto/url-response.dto';
import {UpdateSlugParams} from '@/modules/url/dto/update-slug.param';
import {UpdateSlugDto} from '@/modules/url/dto/update-slug.dto';

@Controller('api/v1/urls')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createShortUrl(@Body() createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    this.logger.log(`Creating short URL for: ${createUrlDto.originalUrl}`);
    return await this.urlService.createShortUrl(createUrlDto);
  }

  @Put(':oldSlug')
  async updateSlug(@Param() param: UpdateSlugParams, @Body() updateSlugDto: UpdateSlugDto): Promise<UrlResponseDto> {
    this.logger.log(`Updating slug: ${param.oldSlug} -> ${updateSlugDto.newSlug}`);
    return await this.urlService.updateSlug(param.oldSlug, updateSlugDto.newSlug);
  }

  @Get()
  async getAllUrls(): Promise<UrlListResponseDto> {
    this.logger.log(`Getting URLs list`);
    return await this.urlService.getAllUrls();
  }
}
