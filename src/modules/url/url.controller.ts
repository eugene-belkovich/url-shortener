import {Controller, Get, Post, Body, Patch, Param, Delete, Logger} from '@nestjs/common';
import {UrlService} from './url.service';
import {CreateUrlDto} from './dto/create-url.dto';
import {UpdateUrlDto} from './dto/update-url.dto';

@Controller('url')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(private readonly urlService: UrlService) {}

  @Post('urls')
  async createShortUrl(@Body() createUrlDto: CreateUrlDto): Promise<any> {
    this.logger.log(`Creating short URL for: ${createUrlDto.originalUrl}`);
    return await this.urlService.createShortUrl(createUrlDto);
  }

  @Get()
  findAll() {
    return this.urlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlService.update(+id, updateUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlService.remove(+id);
  }
}
