import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración global de CORS para permitir todas las solicitudes
  // app.enableCors();

  // Opcional: Configuración específica para un origen y métodos específicos
  app.enableCors({
    origin: 'http://localhost:5173', // Reemplaza esto con tu URL de desarrollo
    methods: ['GET', 'POST'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'], // Encabezados permitidos
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
