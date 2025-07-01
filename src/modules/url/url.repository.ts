import {Injectable, Logger} from '@nestjs/common';
import {CreateUrlParams, UrlRow} from '@/modules/database/types';
import {PrismaService} from '@/modules/database/prisma.service';

@Injectable()
export class UrlRepository {
  private readonly logger = new Logger(UrlRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateUrlParams): Promise<any> {
    const query = `
      INSERT INTO "Url" (original_url, slug, updated_at)
      VALUES ($1, $2, NOW())
      RETURNING id, original_url, slug, created_at, updated_at
    `;

    try {
      const result: UrlRow[] = await this.prisma.$queryRawUnsafe(query, params.originalUrl, params.slug);

      if (result.length === 0) {
        throw new Error('Failed to create URL');
      }

      this.logger.log(`Created URL with slug: ${params.slug}`);
      return result[0];
    } catch (error) {
      this.logger.error(`Failed to create URL: ${error.message}`, error);
      throw error;
    }
  }
}
