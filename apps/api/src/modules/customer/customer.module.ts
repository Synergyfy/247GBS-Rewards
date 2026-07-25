import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CampaignModule } from '../campaign/campaign.module';
import { CustomerPoint } from '../reward/entities/customerPoints.entity';

import { Campaign } from '../campaign/entities/campaign.entity';
import { AuthModule } from '../auth/auth.module';
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
