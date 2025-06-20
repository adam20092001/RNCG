import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // 👇 Agrega esta línea para servir archivos estáticos
  app.use('/public', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
}
bootstrap();
