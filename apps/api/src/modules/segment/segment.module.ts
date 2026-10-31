import { Module } from '@nestjs/common';
import { SegmentService } from './segment.service.js';
import { SegmentController } from './segment.controller.js';
import { BusinessModule } from '../business/business.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Segment } from './entities/segment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Segment]), BusinessModule],
  controllers: [SegmentController],
  providers: [SegmentService],
})
export class SegmentModule {}
