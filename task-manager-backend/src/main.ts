import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200', 'https://task-manager-bay-eight.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
    exposedHeaders: ['Authorization']
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5432);
  console.log('Backend running on http://localhost:5432');
}
bootstrap();