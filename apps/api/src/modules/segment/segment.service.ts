import { Injectable } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Segment } from './entities/segment.entity';
import { Repository } from 'typeorm';
import { Business } from '../business/entities/business.entity';
import { UpdateSegmentDto } from './dto/update-segment.dto';

@Injectable()
export class SegmentService {
  constructor(
    @InjectRepository(Segment)
    private segmentRepository: Repository<Segment>,
  ) {}

  async create(createSegmentDto: CreateSegmentDto, business: Business) {
    const segment = this.segmentRepository.create({
      ...createSegmentDto,
      business,
    });

    await this.segmentRepository.save(segment);
    return segment;
  }

  async findAllByUser(userId: string) {
    const segments = await this.segmentRepository.find({
      where: { business: { user: { id: userId } } },
    });
    return segments;
  }

  async findOne(id: string) {
    const segment = await this.segmentRepository.findOne({ where: { id } });
    return segment;
  }

  async update(segment: Segment, updateSegmentDto: UpdateSegmentDto) {
    Object.assign(segment, updateSegmentDto);
    await this.segmentRepository.save(segment);
    return segment;
  }

  async remove(id: string) {
    await this.segmentRepository.delete(id);
    return `This action removes a #${id} segment`;
  }
}
