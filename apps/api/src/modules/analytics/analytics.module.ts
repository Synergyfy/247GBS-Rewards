import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { CampaignModule } from '../campaign/campaign.module';
import { CustomerModule } from '../customer/customer.module';
import { RewardModule } from '../reward/reward.module';

@Module({
  imports: [CampaignModule, CustomerModule, RewardModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
