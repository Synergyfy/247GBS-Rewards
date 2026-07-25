import { forwardRef, Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity';
import { UserModule } from '../user/user.module';
import { CodeGeneratedByStaffs } from './entities/generateCode.entity';
import { StaffModule } from '../staff/staff.module';
import { CampaignModule } from '../campaign/campaign.module';
import { CustomerModule } from '../customer/customer.module';
import { CustomerPoint } from './entities/customerPoints.entity';
import { CustomerNumber } from './entities/customerNumber.entity';
import { GeneratedRewardCode } from './entities/generateRewardCode.entity';
import { CustomersReward } from './entities/customerRewards.entity';
import { RewardCustomerNumber } from './entities/rewardCustomerNumber.entity';
import { VoucherModule } from '../voucher/voucher.module';
import { Customer } from '../customer/entities/customer.entity';

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
    VoucherModule,
    forwardRef(() => CampaignModule),
    forwardRef(() => CustomerModule),
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
