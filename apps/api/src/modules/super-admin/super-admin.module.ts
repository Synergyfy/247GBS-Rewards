import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { UserModule } from '../user/user.module';
import { BusinessModule } from '../business/business.module';
import { StaffModule } from '../staff/staff.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { CampaignModule } from '../campaign/campaign.module';

@Module({
  imports: [UserModule, BusinessModule, StaffModule, AnalyticsModule, CampaignModule],
  controllers: [SuperAdminController],
})
export class SuperAdminModule {}
