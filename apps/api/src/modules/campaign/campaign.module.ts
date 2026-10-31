import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service.js';
import { CampaignController } from './campaign.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity.js';
import { BusinessModule } from '../business/business.module.js';
import { RewardModule } from '../reward/reward.module.js';
import { Season } from './entities/season.entity.js';
import { SeasonService } from './season.service.js';
import { CustomersReward } from '../reward/entities/customerRewards.entity.js';
import { Customer } from '../customer/entities/customer.entity.js';
import { CustomerPoint } from '../reward/entities/customerPoints.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      Season,
      CustomersReward,
      Customer,
      CustomerPoint,
    ]),
    BusinessModule,
    RewardModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignService, SeasonService],
  exports: [CampaignService, SeasonService],
})
export class CampaignModule {}
