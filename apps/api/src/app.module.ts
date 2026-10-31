import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { BusinessModule } from './modules/business/business.module.js';
import dataSource from './database/data-source.js';
import authConfig from './config/auth.config.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard.js';
import { RolesGuard } from './core/guards/roles.guard.js';
import { StaffModule } from './modules/staff/staff.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { SegmentModule } from './modules/segment/segment.module.js';
import { RewardModule } from './modules/reward/reward.module.js';
import { CampaignModule } from './modules/campaign/campaign.module.js';
import { CustomerModule } from './modules/customer/customer.module.js';
import { AuditModule } from './modules/audit/audit.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { SuperAdminModule } from './modules/super-admin/super-admin.module.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', `.env.${process.env.PROFILE}`, '.env'],
      isGlobal: true,
      expandVariables: true,
      load: [authConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => dataSource,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(currentDir, '..', 'node_modules/swagger-ui-dist'),
      serveRoot: '/api',
    }),
    UserModule,
    AuthModule,
    BusinessModule,
    StaffModule,
    SegmentModule,
    RewardModule,
    CampaignModule,
    CustomerModule,
    AuditModule,
    AnalyticsModule,
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
