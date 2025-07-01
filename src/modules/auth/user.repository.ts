import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '@/modules/database/prisma.service';
import {CreateUserParams, SelectPlaceholder, UserRow} from '@/modules/database/types';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateUserParams): Promise<UserRow> {
    try {
      const result: UserRow[] = await this.prisma.$queryRaw`
        INSERT INTO users (email, password, username, is_active, created_at, updated_at)
        VALUES (${params.email}, ${params.password}, ${params.username}, true, NOW(), NOW())
        RETURNING id, email, password, username, is_active, created_at, updated_at
      `;

      if (result.length === 0) {
        throw new Error('Failed to create user');
      }

      this.logger.log(`Created user with email: ${params.email}`);
      return result[0];
    } catch (error: any) {
      this.logger.error(`Failed to create user: ${error.message}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<UserRow | null> {
    try {
      const result: UserRow[] = await this.prisma.$queryRaw`
        SELECT id, email, password, username, is_active, created_at, updated_at
        FROM users
        WHERE id = ${id} AND is_active = true
      `;

      return result.length > 0 ? result[0] : null;
    } catch (error: any) {
      this.logger.error(`Failed to find user by id ${id}: ${error.message}`, error);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result: SelectPlaceholder[] = await this.prisma.$queryRaw`
        SELECT 1 
        FROM users
        WHERE email = ${email} 
        LIMIT 1
      `;

      return result.length > 0;
    } catch (error: any) {
      this.logger.error(`Failed to check email existence ${email}: ${error.message}`, error);
      throw error;
    }
  }
}
