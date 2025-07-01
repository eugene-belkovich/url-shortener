import {Controller, Get, Post, Body, Logger} from '@nestjs/common';
import {UrlService} from './url.service';
import {CreateUrlDto} from './dto/create-url.dto';
import {UrlListResponseDto, UrlResponseDto} from '@/modules/url/dto/url-response.dto';

@Controller('urls')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createShortUrl(@Body() createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    this.logger.log(`Creating short URL for: ${createUrlDto.originalUrl}`);
    return await this.urlService.createShortUrl(createUrlDto);
  }

  @Get()
  async getAllUrls(): Promise<UrlListResponseDto> {
    this.logger.log(`Getting URLs list`);
    return await this.urlService.getAllUrls();
  }
}
