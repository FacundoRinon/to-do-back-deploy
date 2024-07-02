import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: 'http://localhost:5173', // El dominio permitido para las solicitudes CORS
    methods: ['GET', 'POST'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'], // Encabezados personalizados permitidos
  };

  app.use(cors(corsOptions));

  await app.listen(3000);
}
bootstrap();
