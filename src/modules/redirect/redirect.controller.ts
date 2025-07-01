import {Controller, Get, Logger, Param, Res, HttpStatus} from '@nestjs/common';
import {FastifyReply} from 'fastify';
import {isEmpty} from 'lodash';
import {UrlService} from '@/modules/url/url.service';
import {GetUrlBySlugParams} from '@/modules/redirect/dto/get-url-by-slug.param';

@Controller('')
export class RedirectController {
  private readonly logger = new Logger(RedirectController.name);

  constructor(private readonly urlService: UrlService) {}

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
}
