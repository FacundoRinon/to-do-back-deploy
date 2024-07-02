import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  // app.use(
  //   cors({
  //     origin: 'http://localhost:5173',
  //     credentials: true,
  //   }),
  // );

  // const corsOptions = {
  //   origin: 'http://localhost:5173', // El dominio permitido para las solicitudes CORS
  //   methods: ['GET', 'POST'], // Métodos HTTP permitidos
  // allowedHeaders: ['Content-Type'],
  // };

  // app.use(cors(corsOptions));

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
