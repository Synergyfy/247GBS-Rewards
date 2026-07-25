import { Injectable, ForbiddenException } from '@nestjs/common';
import { CampaignPayload } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { Repository } from 'typeorm';
import { ErrorCreatingCampaign, CampaignDoesntExistException } from '../../httpErrors/campaign.error';
import { formatString, generateRandomCharsFromUUID } from '../../core/helpers/uniquecode';
import { Reward } from '../reward/entities/reward.entity';
import { CampaignType } from '../../core/enums/campaignType';
import { CustomersReward } from '../reward/entities/customerRewards.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerPoint } from '../reward/entities/customerPoints.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(CustomersReward)
    private readonly customerRewardRepo: Repository<CustomersReward>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(CustomerPoint)
    private readonly customerPointRepo: Repository<CustomerPoint>,
  ) {}

  async create(payload: CampaignPayload) {
    const randomSuffix = generateRandomCharsFromUUID();
    const { name } = payload;
    const uniqueCode = `${formatString(name)}-${randomSuffix}`;
    const campaign = this.campaignRepository.create({ ...payload, uniqueCode });
    try {
      await this.campaignRepository.save(campaign);
    } catch {
      throw new ErrorCreatingCampaign();
    }

    return campaign;
  }

  async findAllByUser(userId: string, type?: CampaignType) {
    const whereCondition: any = { business: { user: { id: userId } } };
    if (type) {
      whereCondition.type = type;
    }

    const campaigns = await this.campaignRepository.find({
      where: whereCondition,
      relations: ['business', 'rewards', 'season'],
    });
    return campaigns;
  }

  async findAll() {
    return await this.campaignRepository.find({
      relations: ['business', 'rewards', 'season'],
    });
  }

  async findOneByCode(code: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { uniqueCode: code },
      relations: ['rewards', 'business', 'season'],
    });
    return campaign;
  }

  async findOne(id: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['rewards', 'business', 'season'],
    });
    return campaign;
  }

  async update(
    campaign: Campaign,
    updateCampaignDto: UpdateCampaignDto,
    rewards: Reward[],
  ) {
    const { seasonId, ...updateData } = updateCampaignDto;
    Object.assign(campaign, updateData);

    if (rewards) {
      campaign.rewards = rewards;
    }

    if (seasonId) {
      // Note: We're assuming the controller has validated the season if needed,
      // or we can just set the relationship if we have the ID.
      // For TypeORM, we can often just set the id.
      campaign.season = { id: seasonId } as any;
    } else if (updateCampaignDto.type === CampaignType.PRESET || updateCampaignDto.type === CampaignType.CO_BRANDED) {
      campaign.season = null;
    }

    await this.campaignRepository.save(campaign);
    return campaign;
  }

  isCampaignActive(campaign: Campaign): boolean {
    if (campaign.type !== CampaignType.SEASONAL) {
      return true;
    }

    if (!campaign.season) {
      return false;
    }

    const now = new Date();
    const startDate = new Date(campaign.season.startDate);
    const endDate = new Date(campaign.season.endDate);

    return now >= startDate && now <= endDate;
  }

  async remove(id: string) {
    await this.campaignRepository.delete(id);
    return `This action removes a #${id} campaign`;
  }

  async getCampaignStats(id: string, userId: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['business', 'business.user'],
    });

    if (!campaign) throw new CampaignDoesntExistException();

    if (campaign.business.user.id !== userId) {
      throw new ForbiddenException('You do not own this campaign');
    }

    const totalRedeemed = await this.customerRewardRepo.count({
      where: { campaign: { id } },
    });

    const totalCustomers = await this.customerRepo.count({
      where: { campaign: { id } },
    });

    const pointsIssued = await this.customerPointRepo.sum('points', {
      campaign: { id },
    });

    return {
      totalRedeemed,
      totalCustomers,
      totalPointsIssued: pointsIssued || 0,
    };
  }

  async getCampaignCustomers(
    id: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['business', 'business.user'],
    });

    if (!campaign) throw new CampaignDoesntExistException();

    if (campaign.business.user.id !== userId) {
      throw new ForbiddenException('You do not own this campaign');
    }

    const [data, total] = await this.customerRepo.findAndCount({
      where: { campaign: { id } },
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });

    // Calculate Unique Users (Total Customers)
    const totalUniqueUsers = total;

    // Calculate Unique Redeemers for Conversion Rate
    const uniqueRedeemersResult = await this.customerRewardRepo
      .createQueryBuilder('cr')
      .leftJoin('cr.customer', 'customer')
      .select('COUNT(DISTINCT customer.id)', 'count')
      .where('cr.campaign = :id', { id })
      .getRawOne();
    
    const uniqueRedeemers = Number(uniqueRedeemersResult?.count || 0);
    const avgConversionRate = totalUniqueUsers > 0 
      ? (uniqueRedeemers / totalUniqueUsers) * 100 
      : 0;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
      statistics: {
        avgConversionRate: Number(avgConversionRate.toFixed(2)),
        totalUniqueUsers,
      }
    };
  }

  async getCampaignRedemptions(
    id: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['business', 'business.user'],
    });

    if (!campaign) throw new CampaignDoesntExistException();

    if (campaign.business.user.id !== userId) {
      throw new ForbiddenException('You do not own this campaign');
    }

    const [data, total] = await this.customerRewardRepo.findAndCount({
      where: { campaign: { id } },
      relations: ['customer', 'reward'],
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }
}
