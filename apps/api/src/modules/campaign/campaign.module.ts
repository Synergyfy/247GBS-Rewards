import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { BusinessModule } from '../business/business.module';
import { RewardModule } from '../reward/reward.module';
import { Season } from './entities/season.entity';
import { SeasonService } from './season.service';
import { CustomersReward } from '../reward/entities/customerRewards.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerPoint } from '../reward/entities/customerPoints.entity';

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
