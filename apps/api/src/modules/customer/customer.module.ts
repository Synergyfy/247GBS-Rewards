import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service.js';
import { CustomerController } from './customer.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity.js';
import { CampaignModule } from '../campaign/campaign.module.js';
import { CustomerPoint } from '../reward/entities/customerPoints.entity.js';

import { Campaign } from '../campaign/entities/campaign.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { forwardRef } from '@nestjs/common';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerPoint, Campaign]),
    CampaignModule,
    forwardRef(() => AuthModule),
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
