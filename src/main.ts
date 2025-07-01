import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import helmet from 'helmet';
import * as compression from 'compression';

const bootstrap = async (): Promise<void> => {
  const logger = new Logger('App');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({trustProxy: true, logger: true})
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  const corsOrigins = corsOrigin.split(',').map(origin => origin.trim());

  app.use(helmet());
  app.use(compression());

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // @ts-ignore
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({transform: true}));

  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  await app.listen(port, '0.0.0.0');

  logger.log(`Application is running on PORT: ${port}, ENV: ${nodeEnv}`);
};

bootstrap().catch(error => {
  const logger = new Logger('App');
  logger.error('Failed to start application', error);
  process.exit(1);
});
