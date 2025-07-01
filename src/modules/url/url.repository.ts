import {Injectable, Logger} from '@nestjs/common';
import {CreateUrlParams, SelectPlaceholder, UrlRow} from '@/modules/database/types';
import {PrismaService} from '@/modules/database/prisma.service';

@Injectable()
export class UrlRepository {
  private readonly logger = new Logger(UrlRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateUrlParams): Promise<UrlRow> {
    try {
      const result: UrlRow[] = await this.prisma.$queryRaw`
        INSERT INTO "Url" (original_url, slug, updated_at)
        VALUES ($1, $2, NOW())
        RETURNING id, original_url, slug, created_at, updated_at
      `;
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
    try {
      const result: UrlRow[] = await this.prisma.$queryRaw`
      SELECT
       u.id, 
       u.original_url, 
       u.slug, 
       u.created_at, 
       u.updated_at 
       FROM "Url" as u
    `;

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to find all URLs: ${error.message}`, error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<UrlRow | null> {
    try {
      const result: UrlRow[] = await this.prisma.$queryRaw`
      SELECT id, original_url, slug, created_at, updated_at
      FROM "Url"
      WHERE slug = ${slug} 
    `;
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      this.logger.error(`Failed to find URL by slug ${slug}: ${error.message}`, error);
      throw error;
    }
  }

  async existsByOriginalUrl(originalUrl: string): Promise<boolean> {
    const query = `
    SELECT 1 FROM urls WHERE original_url = $1 LIMIT 1
  `;

    try {
      const result: SelectPlaceholder[] = await this.prisma.$queryRaw`
        SELECT 1 
        FROM "Url" 
        WHERE original_url = ${originalUrl} 
        LIMIT 1
      `;
      return result.length > 0;
    } catch (error) {
      this.logger.error(`Failed to check original_url existence ${originalUrl}: ${error.message}`, error);
      throw error;
    }
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const query = `
    SELECT 1 FROM urls WHERE slug = $1 LIMIT 1
  `;

    try {
      const result: SelectPlaceholder[] = await this.prisma.$queryRaw`
        SELECT 1 
        FROM "Url" 
        WHERE slug = ${slug} 
        LIMIT 1
      `;

      return result.length > 0;
    } catch (error) {
      this.logger.error(`Failed to check slug existence ${slug}: ${error.message}`, error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const result: {count: number}[] = await this.prisma.$queryRaw`SELECT COUNT(*)::INTEGER as count FROM "Url"`;
      return result[0]?.count ?? 0;
    } catch (error: any) {
      this.logger.error(`Failed to count URLs: ${error.message}`, error);
      throw error;
    }
  }
}
