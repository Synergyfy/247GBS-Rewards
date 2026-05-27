import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BusinessModule } from './modules/business/business.module';
import dataSource from './database/data-source';
import authConfig from './config/auth.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard';
import { RolesGuard } from './core/guards/roles.guard';
import { StaffModule } from './modules/staff/staff.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SegmentModule } from './modules/segment/segment.module';
import { RewardModule } from './modules/reward/reward.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AuditModule } from './modules/audit/audit.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';

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
      rootPath: join(__dirname, '..', 'node_modules/swagger-ui-dist'),
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
    VoucherModule,
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
