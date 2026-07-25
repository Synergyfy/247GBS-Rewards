import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Season } from './entities/season.entity';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { BusinessService } from '../business/business.service';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    private readonly businessService: BusinessService,
  ) {}

  async create(createSeasonDto: CreateSeasonDto) {
    const { businessId, ...seasonData } = createSeasonDto;

    const business = await this.businessService.findOne(businessId);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const season = this.seasonRepository.create({
      ...seasonData,
      business,
    });

    return await this.seasonRepository.save(season);
  }

  async findAllByBusiness(businessId: string) {
    return await this.seasonRepository.find({
      where: { business: { id: businessId } },
    });
  }

  async findOne(id: string) {
    const season = await this.seasonRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!season) {
      throw new NotFoundException('Season not found');
    }
    return season;
  }

  async update(id: string, updateSeasonDto: UpdateSeasonDto) {
    const season = await this.findOne(id);
    const { businessId, ...updateData } = updateSeasonDto;
    
    // We intentionally don't update businessId here for simplicity unless requested
    Object.assign(season, updateData);

    return await this.seasonRepository.save(season);
  }

  async remove(id: string) {
    const season = await this.findOne(id);
    return await this.seasonRepository.remove(season);
  }
}
