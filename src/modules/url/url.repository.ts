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

  async findAll(): Promise<UrlRow[]> {
    const query = `
      SELECT 
        u.id,
        u.original_url,
        u.slug,
        u.created_at,
        u.updated_at
      FROM "Url" as u
    `;

    try {
      const result: UrlRow[] = await this.prisma.$queryRawUnsafe(query);
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to find all URLs: ${error.message}`, error);
      throw error;
    }
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*)::INTEGER as count FROM "Url"`;

    try {
      const result: {count: number}[] = await this.prisma.$queryRawUnsafe(query);
      return result[0]?.count ?? 0;
    } catch (error: any) {
      this.logger.error(`Failed to count URLs: ${error.message}`, error);
      throw error;
    }
  }
}
