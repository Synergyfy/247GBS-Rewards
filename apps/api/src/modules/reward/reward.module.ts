import { forwardRef, Module } from '@nestjs/common';
import { RewardService } from './reward.service.js';
import { RewardController } from './reward.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity.js';
import { UserModule } from '../user/user.module.js';
import { CodeGeneratedByStaffs } from './entities/generateCode.entity.js';
import { StaffModule } from '../staff/staff.module.js';
import { CampaignModule } from '../campaign/campaign.module.js';
import { CustomerModule } from '../customer/customer.module.js';
import { CustomerPoint } from './entities/customerPoints.entity.js';
import { CustomerNumber } from './entities/customerNumber.entity.js';
import { GeneratedRewardCode } from './entities/generateRewardCode.entity.js';
import { CustomersReward } from './entities/customerRewards.entity.js';
import { RewardCustomerNumber } from './entities/rewardCustomerNumber.entity.js';
import { Customer } from '../customer/entities/customer.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reward,
      CodeGeneratedByStaffs,
      CustomerPoint,
      CustomerNumber,
      GeneratedRewardCode,
      CustomersReward,
      RewardCustomerNumber,
      Customer,
    ]),
    UserModule,
    StaffModule,
    forwardRef(() => CampaignModule),
    forwardRef(() => CustomerModule),
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
