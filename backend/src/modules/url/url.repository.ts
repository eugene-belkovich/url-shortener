import {Injectable, Logger} from '@nestjs/common';
import {CreateUrlParams, SelectPlaceholder, UrlRow} from '@/modules/database/types';
import {PrismaService} from '@/modules/database/prisma.service';
import {Prisma} from '@prisma/client';

@Injectable()
export class UrlRepository {
  private readonly logger = new Logger(UrlRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createShortUrl(params: CreateUrlParams, prisma?: Prisma.TransactionClient): Promise<UrlRow> {
    const prismaClient = prisma ?? this.prisma;

    try {
      const result: UrlRow[] = await prismaClient.$queryRaw`
         INSERT INTO urls (original_url, slug, user_id, updated_at)
         VALUES (${params.originalUrl}, ${params.slug}, ${params.userId}::bigint, NOW())
         RETURNING id, original_url, slug, user_id, created_at, updated_at
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
          u.user_id, 
          u.created_at, 
          u.updated_at,
          COALESCE(COUNT(a.id), 0)::INTEGER as clicks
        FROM urls u
        LEFT JOIN analytics a ON u.id = a.url_id
        GROUP BY u.id
        ORDER BY clicks DESC
      `;

      return result;
    } catch (error) {
      this.logger.error(`Failed to find all URLs: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
      throw error;
    }
  }

  async findBySlug(slug: string, prisma?: Prisma.TransactionClient): Promise<UrlRow | null> {
    const prismaClient = prisma ?? this.prisma;
    try {
      const result: UrlRow[] = await prismaClient.$queryRaw`
        SELECT id, original_url, slug, user_id, created_at, updated_at
        FROM urls
        WHERE slug = ${slug}
      `;
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      this.logger.error(`Failed to find URL by slug ${slug}: ${error.message}`, error);
      throw error;
    }
  }

  async findByOriginalUrl(originalUrl: string, prisma?: Prisma.TransactionClient): Promise<UrlRow | null> {
    const prismaClient = prisma ?? this.prisma;
    try {
      const result: UrlRow[] = await prismaClient.$queryRaw`
        SELECT id, original_url, slug, user_id, created_at, updated_at
        FROM urls
        WHERE original_url = ${originalUrl}
      `;
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      this.logger.error(`Failed to find URL by originalUrl ${originalUrl}: ${error.message}`, error);
      throw error;
    }
  }

  async updateSlug({oldSlug, newSlug}, prisma?: Prisma.TransactionClient): Promise<UrlRow | null> {
    const prismaClient = prisma ?? this.prisma;

    try {
      const result: UrlRow[] = await prismaClient.$queryRaw`
         UPDATE urls
         SET slug = ${newSlug}, updated_at = NOW()
         WHERE slug = ${oldSlug}
         RETURNING id, original_url, slug, user_id, created_at, updated_at
       `;

      if (result.length === 0) {
        return null;
      }

      this.logger.log(`Updated slug ${oldSlug} -> ${newSlug}`);
      return result[0];
    } catch (error) {
      this.logger.error(`Failed to update slug: ${error.message}`, error);
      throw error;
    }
  }

  async existsByOriginalUrl(originalUrl: string, prisma?: Prisma.TransactionClient): Promise<boolean> {
    const prismaClient = prisma ?? this.prisma;

    try {
      const result: SelectPlaceholder[] = await prismaClient.$queryRaw`
        SELECT 1 
        FROM urls
        WHERE original_url = ${originalUrl} 
        LIMIT 1
      `;
      return result.length > 0;
    } catch (error) {
      this.logger.error(`Failed to check original_url existence ${originalUrl}: ${error.message}`, error);
      throw error;
    }
  }

  async existsBySlug(slug: string, prisma?: Prisma.TransactionClient): Promise<boolean> {
    const prismaClient = prisma ?? this.prisma;

    try {
      const result: SelectPlaceholder[] = await prismaClient.$queryRaw`
        SELECT 1 
        FROM urls
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
      const result: {count: number}[] = await this.prisma.$queryRaw`
        SELECT COUNT(*)::INTEGER as count FROM urls
      `;
      return result[0]?.count ?? 0;
    } catch (error: any) {
      this.logger.error(`Failed to count URLs: ${error.message}`, error);
      throw error;
    }
  }
}
