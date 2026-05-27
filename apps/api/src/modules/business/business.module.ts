import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Address } from './entities/address.entity';
import { Link } from './entities/link.entity';
import { Social } from './entities/socials.entity';
import { UserModule } from '../user/user.module';
import { Season } from '../campaign/entities/season.entity';

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
