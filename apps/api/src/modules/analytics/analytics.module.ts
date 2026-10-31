import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { CampaignModule } from '../campaign/campaign.module.js';
import { CustomerModule } from '../customer/customer.module.js';
import { RewardModule } from '../reward/reward.module.js';

@Module({
  imports: [CampaignModule, CustomerModule, RewardModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
