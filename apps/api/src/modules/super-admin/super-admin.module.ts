import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuperAdminController } from './super-admin.controller.js';
import { SuperAdminService } from './super-admin.service.js';
import { SuperAdminAuditLog } from './entities/super-admin-audit-log.entity.js';

import { User } from '../user/entities/user.entity.js';
import { Business } from '../business/entities/business.entity.js';
import { Address } from '../business/entities/address.entity.js';
import { Social } from '../business/entities/socials.entity.js';
import { Link } from '../business/entities/link.entity.js';
import { Staff } from '../staff/entities/staff.entity.js';
import { Campaign } from '../campaign/entities/campaign.entity.js';
import { Customer } from '../customer/entities/customer.entity.js';
import { CustomerPoint } from '../reward/entities/customerPoints.entity.js';
import { CustomersReward } from '../reward/entities/customerRewards.entity.js';
import { CodeGeneratedByStaffs } from '../reward/entities/generateCode.entity.js';
import { GeneratedRewardCode } from '../reward/entities/generateRewardCode.entity.js';
import { RewardCustomerNumber } from '../reward/entities/rewardCustomerNumber.entity.js';
import { CustomerNumber } from '../reward/entities/customerNumber.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Business,
      Address,
      Social,
      Link,
      Staff,
      Campaign,
      Customer,
      CustomerPoint,
      CustomersReward,
      CodeGeneratedByStaffs,
      GeneratedRewardCode,
      RewardCustomerNumber,
      CustomerNumber,
      SuperAdminAuditLog,
    ]),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}
