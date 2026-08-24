import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// 1. Shared Configuration Function
// This setup applies to both Local and Vercel environments
async function configureApp(app: any) {
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
      'https://247gbsrewards.vercel.app',
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
  SwaggerModule.setup('api-docs', app, document, {
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.css',
    ],
  });

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

const ALLOWED_ORIGINS = [
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
  'https://mcom-redeem.netlify.app',
  'https://stockaudits.netlify.app',
  'https://loyaltyprogramm.netlify.app',
  'https://247gbs-rewards.netlify.app',
  'https://247gbsrewards.vercel.app',
];

function getCorsHeaders(origin: string | undefined) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export default async (req: any, res: any) => {
  const origin = req.headers?.origin;
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  try {
    if (!cachedApp) {
      const app = await NestFactory.create(AppModule);
      await configureApp(app);
      await app.init();
      cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp(req, res);
  } catch (error) {
    console.error('Vercel handler error:', error);
    res.writeHead(500, corsHeaders);
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

