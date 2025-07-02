import {Controller, Get, Logger, Param, Res, HttpStatus, Req} from '@nestjs/common';
import {FastifyReply, FastifyRequest} from 'fastify';
import {isEmpty} from 'lodash';
import {UrlService} from '@/modules/url/url.service';
import {GetUrlBySlugParams} from '@/modules/redirect/dto/get-url-by-slug.param';
import {AnalyticsService} from '@/modules/analytics/analytics.service';

@Controller('')
export class RedirectController {
  private readonly logger = new Logger(RedirectController.name);

  constructor(
    private readonly urlService: UrlService,
    private readonly analyticsService: AnalyticsService
  ) {}

  @Get(':slug')
  async redirectToOriginalUrl(
    @Param() param: GetUrlBySlugParams,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest
  ): Promise<void> {
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
    try {
      const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.ip || '';

      await this.analyticsService.track({
        urlId: urlRecord.id || null,
        ipAddress: ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        visitedAt: new Date(),
        originalUrl: urlRecord.originalUrl,
        slug: urlRecord.slug
      });
    } catch (error) {
      this.logger.error(`Failed to record visit analytics: ${error.message}`, error);
    }

    res.headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    });

    res.redirect(urlRecord.originalUrl, HttpStatus.FOUND);
  }
}
