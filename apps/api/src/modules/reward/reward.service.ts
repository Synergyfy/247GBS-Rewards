import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { Campaign } from '../campaign/entities/campaign.entity';
import { Staff } from '../staff/entities/staff.entity';
import { CodeGeneratedByStaffs } from './entities/generateCode.entity';
import { calculateExpirationDate } from '../../core/helpers/expiryDate';
import { generateRandomCode } from '../../core/helpers/uniquecode';
import { CustomerPoint } from './entities/customerPoints.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerNumber } from './entities/customerNumber.entity';
import { GeneratedRewardCode } from './entities/generateRewardCode.entity';
import { CustomersReward } from './entities/customerRewards.entity';
import { RewardCustomerNumber } from './entities/rewardCustomerNumber.entity';
import { RewardMethod } from '../../core/enums/rewardMethod';
import { CampaignService } from '../campaign/campaign.service';
import { VoucherService } from '../voucher/voucher.service';
import { VoucherType } from '../voucher/entities/voucher.entity';
import { RewardDoesntExistException } from '../../httpErrors/reward.error';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(CodeGeneratedByStaffs)
    private staffcodeRepository: Repository<CodeGeneratedByStaffs>,
    @InjectRepository(CustomerPoint)
    private customerPointRepo: Repository<CustomerPoint>,
    @InjectRepository(CustomerNumber)
    private customerNumberRepo: Repository<CustomerNumber>,
    @InjectRepository(GeneratedRewardCode)
    private rewardCodeRepo: Repository<GeneratedRewardCode>,
    @InjectRepository(CustomersReward)
    private customerRewardRepo: Repository<CustomersReward>,
    @InjectRepository(RewardCustomerNumber)
    private rewardCustomerNumberRepo: Repository<RewardCustomerNumber>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private readonly campaignService: CampaignService,
    private readonly voucherService: VoucherService,
  ) {}

  async create(createRewardDto: CreateRewardDto, user: User) {
    const reward = this.rewardRepository.create({
      ...createRewardDto,
      type: createRewardDto.type || 'STANDARD',
      quantityRemaining: createRewardDto.quantityAvailable || 0,
      user,
    });
    await this.rewardRepository.save(reward);
    return reward;
  }

  async findAllByUser(userId: string) {
    const rewards = await this.rewardRepository.find({
      where: { user: { id: userId } },
    });
    return rewards;
  }

  async findOne(id: string) {
    const reward = await this.rewardRepository.findOne({ where: { id } });
    return reward;
  }

  async findByIds(ids: string[]) {
    const rewards = await this.rewardRepository.findBy({ id: In(ids) });
    return rewards;
  }

  async update(reward: Reward, updateRewardDto: UpdateRewardDto) {
    Object.assign(reward, updateRewardDto);

    await this.rewardRepository.save(reward);
    return reward;
  }

  async remove(id: string) {
    await this.rewardRepository.delete(id);
  }

  // STAFF GIVING POINTS SECTION

  async generateCode(
    campaign: Campaign,
    staff: Staff,
    points: number,
    expiry: 'day' | 'hour' | 'week' | 'month',
    type: string = '1',
  ) {
    const expiryDate = calculateExpirationDate(expiry);
    const pointCode = generateRandomCode();
    const code = this.staffcodeRepository.create({
      campaign,
      staff,
      points,
      code: pointCode,
      expiry: expiryDate,
      type,
    });

    await this.staffcodeRepository.save(code);
    return code;
  }

  async generateBulkCodes(
    campaign: Campaign,
    creator: Staff | User,
    points: number,
    quantity: number,
    expiry: 'day' | 'hour' | 'week' | 'month',
    type: string = '1',
  ) {
    const expiryDate = calculateExpirationDate(expiry);
    const codes: CodeGeneratedByStaffs[] = [];

    for (let i = 0; i < quantity; i++) {
      const pointCode = generateRandomCode();
      const codeEntity = this.staffcodeRepository.create({
        campaign,
        points,
        code: pointCode,
        expiry: expiryDate,
        type,
      });

      if (creator instanceof Staff) {
        codeEntity.staff = creator;
      } else {
        codeEntity.user = creator as User;
      }

      codes.push(codeEntity);
    }

    await this.staffcodeRepository.save(codes);
    return codes;
  }

  async getGenerateCodes(campaignId: string, page: number = 1, limit: number = 10) {
    const currentDate = new Date();
    const [codes, total] = await this.staffcodeRepository.findAndCount({
      where: { campaign: { id: campaignId }, expiry: MoreThan(currentDate) },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    });

    return { data: codes, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async validateCode(
    campaign: Campaign,
    customer: Customer,
    code: string,
    type: '1' | '2',
  ) {
    const currentDate = new Date();
    const point = await this.staffcodeRepository.findOne({
      where: {
        code,
        campaign: { id: campaign.id },
        expiry: MoreThan(currentDate),
      },
    });

    if (!point) return false;

    if (point.type !== type) return false;

    let description = 'Points from entering code';

    if (!point) return false;

    if (point.type === '2') {
      description = "Points from entering merchat's code";
    }

    const customerPoint = this.customerPointRepo.create({
      campaign,
      customer,
      description,
      points: point.points,
    });

    await this.customerPointRepo.save(customerPoint);
    if (point.type === '1') {
      await this.staffcodeRepository.delete(point.id);
    }

    return customerPoint;
  }

  // customer code

  async generateCustomerNumber(campaign: Campaign, customer: Customer) {
    const code = generateRandomCode();
    const customerNumber = this.customerNumberRepo.create({
      campaign,
      customer,
      code,
    });
    await this.customerNumberRepo.save(customerNumber);
    return customerNumber;
  }

  async validateCustomerNumber(
    code: string,
    points: string,
    type: RewardMethod,
  ) {
    const customerNumber = await this.customerNumberRepo.findOne({
      where: { code },
      relations: ['campaign', 'customer'],
    });

    if (!customerNumber) return false;

    const { campaign, customer } = customerNumber;

    if (!this.campaignService.isCampaignActive(campaign)) {
      return 'campaign inactive';
    }

    let description;

    if (type === RewardMethod.QR) {
      description = 'Points from staff scanning QR code';
    } else if (type === RewardMethod.CustomerNumber) {
      description = 'Points from staff entering customer number';
    }

    const customerPoint = this.customerPointRepo.create({
      customer,
      campaign,
      description,
      points: +points,
    });
    await this.customerPointRepo.save(customerPoint);

    await this.customerNumberRepo.delete(customerNumber.id);

    return customerPoint;
  }

  async getPointForCampaign(userId: string, campaignId: string) {
    //GET CUSTOMER'S POINT FOR A PARTICULAR CAMPAIGN
    const points = await this.customerPointRepo.find({
      where: { campaign: { id: campaignId }, customer: { id: userId } },
    });

    return points;
  }

  // STAFF REDEEMING POINTS SECTION

  async generateRewardCode(
    campaign: Campaign,
    staff: Staff,
    reward: Reward,
    expiry: 'day' | 'hour' | 'week' | 'month',
  ) {
    const expiryDate = calculateExpirationDate(expiry);
    const pointCode = generateRandomCode();
    const code = this.rewardCodeRepo.create({
      campaign,
      staff,
      reward,
      code: pointCode,
      expiry: expiryDate,
    });

    await this.rewardCodeRepo.save(code);
    return code;
  }

  async generateRewardCustomerNumber(
    campaign: Campaign,
    customer: Customer,
    type: RewardMethod,
  ) {
    const code = generateRandomCode();
    const customerNumber = this.rewardCustomerNumberRepo.create({
      campaign,
      customer,
      code,
      type,
    });
    await this.rewardCustomerNumberRepo.save(customerNumber);
    return customerNumber;
  }

  async validateCustomerRewardNumber(
    code: string,
    type: RewardMethod,
    reward: Reward,
  ) {
    const customerNumber = await this.rewardCustomerNumberRepo.findOne({
      where: { code },
      relations: ['campaign', 'campaign.rewards', 'customer'],
    });

    if (!customerNumber) return false;
    if (customerNumber.type !== type) return false;

    const { campaign, customer } = customerNumber;

    if (!this.campaignService.isCampaignActive(campaign)) {
      return 'campaign inactive';
    }

    let description;
    if (type === RewardMethod.QR) {
      description = 'Reward redeemed by staff scanning QR code';
    } else if (type === RewardMethod.CustomerNumber) {
      description = 'Reward redeemed by staff entering customer number';
    }

    const pointCost = +reward.pointCost;
    const customerBalance = await this.calculatePointBalance(
      campaign.id,
      customer.id,
    );

    if (pointCost > customerBalance) {
      return 'insufficient point balance';
    }

    const customerReward = this.customerRewardRepo.create({
      customer,
      campaign,
      description,
      reward,
    });

    await this.customerRewardRepo.save(customerReward);

    await this.customerNumberRepo.delete(customerNumber.id);

    return customerReward;
  }

  async validateRewardCode(
    campaign: Campaign,
    customer: Customer,
    code: string,
  ) {
    const currentDate = new Date();
    const redeem = await this.rewardCodeRepo.findOne({
      where: {
        code,
        campaign: { id: campaign.id },
        expiry: MoreThan(currentDate),
      },
      relations: ['reward'],
    });
    if (!redeem) return false;

    const pointCost = +redeem.reward.pointCost;
    const customerBalance = await this.calculatePointBalance(
      campaign.id,
      customer.id,
    );

    if (pointCost > customerBalance) {
      return 'insufficient point balance';
    }

    const description = 'Redeemed by entering merchant code.';

    const reward = redeem.reward;

    const customerReward = this.customerRewardRepo.create({
      campaign,
      customer,
      description,
      reward,
    });

    await this.customerRewardRepo.save(customerReward);

    return customerReward;
  }

  async getCustomerPointHistory(campaignId: string, customerId: string) {
    const points = await this.customerPointRepo.find({
      where: { customer: { id: customerId }, campaign: { id: campaignId } },
      order: { created_at: 'DESC' },
    });

    return points;
  }

  async getCampaignPointHistory(campaignId: string) {
    const points = await this.customerPointRepo.find({
      where: { campaign: { id: campaignId } },
      order: { created_at: 'DESC' },
    });

    return points;
  }

  async getCampaignRewardHistory(campaignId: string) {
    const rewards = await this.customerRewardRepo.find({
      where: { campaign: { id: campaignId } },
      relations: ['reward'],
      order: { created_at: 'DESC' },
    });

    return rewards;
  }

  async getCustomerRewardHistory(campaignId: string, customerId: string) {
    const rewards = await this.customerRewardRepo.find({
      where: { customer: { id: customerId }, campaign: { id: campaignId } },
      relations: ['reward'],
      order: { created_at: 'DESC' },
    });

    return rewards;
  }

  async calculatePointBalance(campaignId: string, customerId: string) {
    const points = await this.customerPointRepo.find({
      where: { campaign: { id: campaignId }, customer: { id: customerId } },
    });

    const totalPoints = points.reduce((acc, point) => acc + point.points, 0);

    const reward = await this.customerRewardRepo.find({
      where: { campaign: { id: campaignId }, customer: { id: customerId } },
      relations: ['reward'],
    });

    const totalRewards = reward.reduce(
      (acc, reward) => acc + +reward.reward.pointCost,
      0,
    );

    return totalPoints - totalRewards;
  }

  async redeemRewardSelfService(
    campaign: Campaign,
    customer: Customer,
    rewardId: string,
  ) {
    const reward = await this.rewardRepository.findOne({
      where: { id: rewardId },
    });

    if (!reward) return 'reward not found';

    if (reward.quantityRemaining <= 0) {
      return 'reward out of stock';
    }

    const pointCost = +reward.pointCost;
    const customerBalance = await this.calculatePointBalance(
      campaign.id,
      customer.id,
    );

    if (pointCost > customerBalance) {
      return 'insufficient point balance';
    }

    const description = 'Redeemed by customer (self-service).';

    // Check if dynamic voucher generation is needed
    let uniqueCode: string | null = null;
    if (reward.type && reward.type !== 'STANDARD') {
        try {
            // Map reward type to VoucherType if they match directly
            const voucher = await this.voucherService.generateSingle(
                reward.type as VoucherType,
                reward.config
            );
            uniqueCode = voucher.code;
        } catch (error) {
            // Log error but maybe fail redemption? 
            // For now, let's fail redemption if provisioning fails.
            return 'failed to provision reward';
        }
    }

    const customerReward = this.customerRewardRepo.create({
      campaign,
      customer,
      description,
      reward,
      uniqueCode,
    });

    // Transactional consistency would be better here, but following existing pattern
    await this.customerRewardRepo.save(customerReward);
    
    reward.quantityRemaining -= 1;
    await this.rewardRepository.save(reward);

    return customerReward;
  }

  async getRewardStats(id: string, userId: string) {
    const reward = await this.rewardRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!reward) throw new RewardDoesntExistException();

    if (reward.user.id !== userId) {
      throw new ForbiddenException('You do not own this reward');
    }

    const campaignId = reward.campaign?.id;
    let totalCampaignCustomers = 0;
    
    // We need to fetch the campaign ID if it wasn't loaded (though relation might be lazy or not loaded)
    // The previous findOne only loaded 'user'. Let's load 'campaign' too to be safe or use query builder.
    // Actually, let's just count customers for the campaign linked to this reward.
    if (campaignId) {
         totalCampaignCustomers = await this.customerRepo.count({ where: { campaign: { id: campaignId } } });
    } else {
        // Fallback if campaign relation isn't loaded, fetch reward with campaign
        const r = await this.rewardRepository.findOne({ where: { id }, relations: ['campaign'] });
        if (r && r.campaign) {
             totalCampaignCustomers = await this.customerRepo.count({ where: { campaign: { id: r.campaign.id } } });
        }
    }

    const totalRedeemed = await this.customerRewardRepo.count({
      where: { reward: { id } },
    });

    const uniqueCustomersResult = await this.customerRewardRepo
      .createQueryBuilder('cr')
      .leftJoin('cr.customer', 'customer')
      .select('COUNT(DISTINCT customer.id)', 'count')
      .where('cr.reward = :id', { id })
      .getRawOne();
    
    const uniqueCustomers = Number(uniqueCustomersResult?.count || 0);

    const avgConversionRate = totalCampaignCustomers > 0
        ? (uniqueCustomers / totalCampaignCustomers) * 100
        : 0;

    const totalPointsSpent = totalRedeemed * Number(reward.pointCost || 0);

    return {
      totalRedeemed,
      uniqueCustomers,
      totalUniqueUsers: uniqueCustomers,
      avgConversionRate: Number(avgConversionRate.toFixed(2)),
      totalPointsSpent,
    };
  }

  async getRewardRedemptions(
    id: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const reward = await this.rewardRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!reward) throw new RewardDoesntExistException();

    if (reward.user.id !== userId) {
      throw new ForbiddenException('You do not own this reward');
    }

    const [data, total] = await this.customerRewardRepo.findAndCount({
      where: { reward: { id } },
      relations: ['customer'],
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
