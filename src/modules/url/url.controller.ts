import {Controller, Get, Post, Body, Logger, Param, Res, Req, HttpStatus} from '@nestjs/common';
import {FastifyReply} from 'fastify';
import {isEmpty} from 'lodash';

import {UrlService} from './url.service';
import {CreateUrlDto} from './dto/create-url.dto';
import {UrlListResponseDto, UrlResponseDto} from '@/modules/url/dto/url-response.dto';
import {GetUrlBySlugParams} from '@/modules/url/dto/get-url-by-slug.dto';

@Controller('urls')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createShortUrl(@Body() createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    this.logger.log(`Creating short URL for: ${createUrlDto.originalUrl}`);
    return await this.urlService.createShortUrl(createUrlDto);
  }

  @Get(':slug')
  async redirectToOriginalUrl(@Param() param: GetUrlBySlugParams, @Res() res: FastifyReply): Promise<void> {
    this.logger.log(`Redirecting slug: ${param.slug}`);

    const urlRecord = await this.urlService.getUrlBySlug(param.slug);

    if (!urlRecord || isEmpty(urlRecord.originalUrl)) {
      this.logger.warn(`URL not found for slug: ${param.slug}`);
      res.status(HttpStatus.NOT_FOUND).send({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'URL not found',
        error: 'Not Found'
      });
      return;
    }

    res.headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    });

    res.redirect(urlRecord.originalUrl, HttpStatus.FOUND);
  }

  @Get()
  async getAllUrls(): Promise<UrlListResponseDto> {
    this.logger.log(`Getting URLs list`);
    return await this.urlService.getAllUrls();
  }
}
