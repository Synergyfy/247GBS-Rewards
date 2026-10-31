import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller.js';
import { UserModule } from '../user/user.module.js';
import { BusinessModule } from '../business/business.module.js';
import { StaffModule } from '../staff/staff.module.js';
import { AnalyticsModule } from '../analytics/analytics.module.js';
import { CampaignModule } from '../campaign/campaign.module.js';

@Module({
  imports: [UserModule, BusinessModule, StaffModule, AnalyticsModule, CampaignModule],
  controllers: [SuperAdminController],
})
export class SuperAdminModule {}
