import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Seeder } from './seeder';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import MongoMemoryServer from 'mongodb-memory-server-core';

async function bootstrap() {

  // Run with in-memory Mongo
  if (process.env.INMEMORY_MONGODB === 'true') {
    const mongod = new MongoMemoryServer();
    process.env.MONGODB_URI = await mongod.getUri();
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(helmet());
  app.enableCors({
    'origin': configService.get('ORIGIN', '*').split(','),
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204
  });
  const seeder = app.get(Seeder);
  await seeder.seed();
  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
