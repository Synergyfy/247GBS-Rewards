import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { hashPassword } from '../../bcypt/bcrypt';
import { Campaign } from '../campaign/entities/campaign.entity';
import { CustomerPoint } from '../reward/entities/customerPoints.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(CustomerPoint)
    private readonly cstPointRepository: Repository<CustomerPoint>,

    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, campaign: Campaign) {
    const { password } = createCustomerDto;
    const hashedPassword = await hashPassword(password);
    const customer = this.customerRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
      campaign,
    });
    await this.customerRepository.save(customer);

    const reward = campaign.signupPoints;
    const customerPoint = this.cstPointRepository.create({
      campaign,
      customer,
      points: +reward,
      description: 'Sign up reward',
    });

    await this.cstPointRepository.save(customerPoint);

    return 'Account Successfully Created';
  }

  async findOneByEmail(email: string, campaignId: string) {
    if (!campaignId) return null;
    const customer = await this.customerRepository.findOne({
      where: { email, campaign: { id: campaignId } },
    });
    return customer;
  }

  async checkEmailExistsForCampaign(email: string, campaign: string) {
    const customer = await this.customerRepository.findOne({
      where: { email, campaign: { id: campaign } },
    });
    return customer;
  }

  async findAllByCampaign(campaignId: string) {
    return await this.customerRepository.find({
      where: { campaign: { id: campaignId } },
    });
  }

  async isJoined(email: string, campaignId: string) {
    const exists = await this.findOneByEmail(email, campaignId);
    return { isJoined: !!exists };
  }

  async joinCampaign(user: Customer, campaignId: string) {
    // 1. Check if already joined
    const existing = await this.findOneByEmail(user.email, campaignId);
    if (existing) {
        return { message: 'Already joined', isJoined: true };
    }

    // 2. Find Campaign
    const campaign = await this.campaignRepository.findOne({ where: { id: campaignId } });
    if (!campaign) {
        throw new Error('Campaign not found');
    }

    // 3. Clone User
    const newCustomer = this.customerRepository.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password, // Already hashed
        campaign: campaign,
    });

    await this.customerRepository.save(newCustomer);

    // 4. Award Signup Points
    if (campaign.signupPoints) {
        const point = this.cstPointRepository.create({
            campaign,
            customer: newCustomer,
            points: +campaign.signupPoints,
            description: 'Sign up reward',
        });
        await this.cstPointRepository.save(point);
    }

    return { message: 'Successfully joined campaign', isJoined: true };
  }

  findAll() {
    return `This action returns all customer`;
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    return customer;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
