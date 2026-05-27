import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT,PATCH, DELETE, OPTIONS',
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(200).send();
    } else {
      next();
    }
  });

  app.enableCors({
    origin: [
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3009',
      'http://127.0.0.1:7000',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3009',
      'http://localhost:7000',
      'https://mcom-api-psi.vercel.app',
      'https://mcom-az.netlify.app',
      'https://stockaudit.netlify.app',
      'https://mcom-redeem.netlify.app/',
      'https://stockaudits.netlify.app/',
      'https://loyaltyprogramm.netlify.app/',
      'https://247gbs-rewards.netlify.app/',
    ],
    methods: 'GET, HEAD, PUT, PATCH, DELETE, OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('MCOM API')
    .setDescription('MCOM API (REST)')
    .setVersion('1.0')
    .addTag('mcom')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

// https://app.getpostman.com/join-team?invite_code=fdcca7058c17b3f90a2552eecbdea456ece9de15db36733ddca5c92746b9d9cf
