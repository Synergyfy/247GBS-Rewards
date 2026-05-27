import { Module } from '@nestjs/common';
import { SegmentService } from './segment.service';
import { SegmentController } from './segment.controller';
import { BusinessModule } from '../business/business.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Segment } from './entities/segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Segment]), BusinessModule],
  controllers: [SegmentController],
  providers: [SegmentService],
})
export class SegmentModule {}
