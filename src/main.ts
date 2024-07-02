import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
