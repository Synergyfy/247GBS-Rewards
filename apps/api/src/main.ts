import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// 1. Shared Configuration Function
// This setup applies to both Local and Vercel environments
async function configureApp(app: any) {
  app.use((req: any, res: any, next: any) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS',
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
      'https://247gbsrewards.vercel.app/',
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
}

// 2. Local Development Bootstrap
// This only runs if you execute the file directly (e.g., `nest start` or `node dist/main`)
if (require.main === module) {
  async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    await configureApp(app);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
  bootstrap();
}

// 3. Vercel Serverless Handler
// Vercel imports this file and calls the default export
let cachedApp: any;

export default async (req: any, res: any) => {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await configureApp(app);
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp(req, res);
};

