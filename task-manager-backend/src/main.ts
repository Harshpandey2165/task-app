import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://task-app-ten-delta.vercel.app','http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    maxAge: 86400,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5432);
  console.log('Backend running on http://localhost:5432');
}
bootstrap();
