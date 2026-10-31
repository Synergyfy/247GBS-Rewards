import { Module } from '@nestjs/common';
import { BusinessService } from './business.service.js';
import { BusinessController } from './business.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity.js';
import { Address } from './entities/address.entity.js';
import { Link } from './entities/link.entity.js';
import { Social } from './entities/socials.entity.js';
import { UserModule } from '../user/user.module.js';
import { Season } from '../campaign/entities/season.entity.js';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  imports: [
    TypeOrmModule.forFeature([Business, Address, Link, Social, Season]),
    UserModule,
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
