import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS AVANT listen
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // ✅ PIPES AVANT listen
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ BODY SIZE LIMITS AVANT listen
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  // ✅ SERVE STATIC UPLOADS
  // /uploads/avatars/xxx.png => backend/uploads/avatars/xxx.png
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`✅ API running on http://localhost:${port}`);
}
bootstrap();
