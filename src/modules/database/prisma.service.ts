import {Injectable, OnModuleInit, OnModuleDestroy, Logger} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');

    super({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
