import { Test, TestingModule } from '@nestjs/testing';
import { RewardService } from './reward.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Reward } from './entities/reward.entity';
import { CodeGeneratedByStaffs } from './entities/generateCode.entity';
import { CustomerPoint } from './entities/customerPoints.entity';
import { CustomerNumber } from './entities/customerNumber.entity';
import { GeneratedRewardCode } from './entities/generateRewardCode.entity';
import { CustomersReward } from './entities/customerRewards.entity';
import { RewardCustomerNumber } from './entities/rewardCustomerNumber.entity';
import { CampaignService } from '../campaign/campaign.service';
import { Repository } from 'typeorm';
import { Campaign } from '../campaign/entities/campaign.entity';
import { Staff } from '../staff/entities/staff.entity';
import { User } from '../user/entities/user.entity';
import { Customer } from '../customer/entities/customer.entity';
import { VoucherService } from '../voucher/voucher.service';

describe('RewardService', () => {
  let service: RewardService;
  let staffCodeRepo: Repository<CodeGeneratedByStaffs>;
  let rewardRepo: Repository<Reward>;
  let customerRewardRepo: Repository<CustomersReward>;
  let customerPointRepo: Repository<CustomerPoint>;

  const mockStaffCodeRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockRewardRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockCustomerRewardRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockCustomerPointRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockCampaignService = {
    isCampaignActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardService,
        {
          provide: getRepositoryToken(Reward),
          useValue: mockRewardRepo,
        },
        {
          provide: getRepositoryToken(CodeGeneratedByStaffs),
          useValue: mockStaffCodeRepo,
        },
        {
          provide: getRepositoryToken(CustomerPoint),
          useValue: mockCustomerPointRepo,
        },
        {
          provide: getRepositoryToken(CustomerNumber),
          useValue: {},
        },
        {
          provide: getRepositoryToken(GeneratedRewardCode),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CustomersReward),
          useValue: mockCustomerRewardRepo,
        },
        {
          provide: getRepositoryToken(RewardCustomerNumber),
          useValue: {},
        },
        {
          provide: CampaignService,
          useValue: mockCampaignService,
        },
        {
          provide: VoucherService,
          useValue: {
            generateSingle: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RewardService>(RewardService);
    staffCodeRepo = module.get(getRepositoryToken(CodeGeneratedByStaffs));
    rewardRepo = module.get(getRepositoryToken(Reward));
    customerRewardRepo = module.get(getRepositoryToken(CustomersReward));
    customerPointRepo = module.get(getRepositoryToken(CustomerPoint));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reward with type and config', async () => {
      const user = new User();
      const createDto: CreateRewardDto = {
        title: 'Test Reward',
        pointCost: '100',
        currency: '$',
        rewardValue: '10',
        activeFrom: '2023-01-01',
        expires: '2023-12-31',
        type: 'LINK',
        config: { url: 'https://example.com' },
      };

      mockRewardRepo.create.mockImplementation((dto: CreateRewardDto) => dto);
      mockRewardRepo.save.mockResolvedValue({ id: '1', ...createDto, user } as Reward);

      const result = await service.create(createDto, user);

      expect(mockRewardRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'LINK',
          config: { url: 'https://example.com' },
          user,
        }),
      );
      expect(mockRewardRepo.save).toHaveBeenCalled();
      expect(result.type).toBe('LINK');
      expect(result.config.url).toBe('https://example.com');
    });
  });

  describe('generateBulkCodes', () => {
    it('should generate multiple codes for a staff', async () => {
      const campaign = new Campaign();
      const staff = new Staff();
      const quantity = 5;
      const points = 100;

      mockStaffCodeRepo.create.mockImplementation((dto: Partial<CodeGeneratedByStaffs>) => dto);
      mockStaffCodeRepo.save.mockResolvedValue([]);

      await service.generateBulkCodes(
        campaign,
        staff,
        points,
        quantity,
        'day',
        '1',
      );

      expect(mockStaffCodeRepo.create).toHaveBeenCalledTimes(quantity);
      expect(mockStaffCodeRepo.save).toHaveBeenCalled();
      const firstCallArgs = mockStaffCodeRepo.create.mock.calls[0][0];
      expect(firstCallArgs.points).toBe(points);
      expect(firstCallArgs.staff).toBe(staff);
    });

    it('should generate multiple codes for a user (admin)', async () => {
      const campaign = new Campaign();
      const user = new User();
      const quantity = 3;
      const points = 50;

      mockStaffCodeRepo.create.mockImplementation((dto: Partial<CodeGeneratedByStaffs>) => dto);
      mockStaffCodeRepo.save.mockResolvedValue([]);

      await service.generateBulkCodes(
        campaign,
        user,
        points,
        quantity,
        'day',
        '1',
      );

      expect(mockStaffCodeRepo.create).toHaveBeenCalledTimes(quantity);
      const callArgs = mockStaffCodeRepo.save.mock.calls[0][0];
      expect(callArgs).toHaveLength(quantity);
      expect(callArgs[0].user).toBe(user);
    });
  });

  describe('redeemRewardSelfService', () => {
    it('should fail if reward not found', async () => {
      mockRewardRepo.findOne.mockResolvedValue(null);
      const result = await service.redeemRewardSelfService(
        new Campaign(),
        new Customer(),
        'rewardId',
      );
      expect(result).toBe('reward not found');
    });

    it('should fail if reward out of stock', async () => {
      const reward = new Reward();
      reward.quantityRemaining = 0;
      mockRewardRepo.findOne.mockResolvedValue(reward);

      const result = await service.redeemRewardSelfService(
        new Campaign(),
        new Customer(),
        'rewardId',
      );
      expect(result).toBe('reward out of stock');
    });

    it('should fail if insufficient balance', async () => {
      const reward = new Reward();
      reward.quantityRemaining = 5;
      reward.pointCost = '100';
      mockRewardRepo.findOne.mockResolvedValue(reward);

      // Mock calculatePointBalance
      // totalPoints - totalRewards
      // Let's mock finding points and rewards
      mockCustomerPointRepo.find.mockResolvedValue([{ points: 50 }]); // Total 50
      mockCustomerRewardRepo.find.mockResolvedValue([]); // Spent 0

      const result = await service.redeemRewardSelfService(
        { id: 'camp1' } as Campaign,
        { id: 'cust1' } as Customer,
        'rewardId',
      );
      expect(result).toBe('insufficient point balance');
    });

    it('should succeed if balance sufficient and in stock', async () => {
      const reward = new Reward();
      reward.quantityRemaining = 5;
      reward.pointCost = '50';
      mockRewardRepo.findOne.mockResolvedValue(reward);

      mockCustomerPointRepo.find.mockResolvedValue([{ points: 100 }]); // Total 100
      mockCustomerRewardRepo.find.mockResolvedValue([]); // Spent 0

      const campaign = { id: 'camp1' } as Campaign;
      const customer = { id: 'cust1' } as Customer;

      mockCustomerRewardRepo.create.mockReturnValue({
        campaign,
        customer,
        reward,
      });

      const result = await service.redeemRewardSelfService(
        campaign,
        customer,
        'rewardId',
      );

      expect(mockCustomerRewardRepo.save).toHaveBeenCalled();
      expect(mockRewardRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ quantityRemaining: 4 }),
      );
      expect(result).toBeDefined();
    });
  });
});