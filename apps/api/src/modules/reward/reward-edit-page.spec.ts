import { Test, TestingModule } from '@nestjs/testing';
import { RewardService } from './reward.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from './entities/reward.entity';
import { User } from '../user/entities/user.entity';
import { CodeGeneratedByStaffs } from './entities/generateCode.entity';
import { CustomerPoint } from './entities/customerPoints.entity';
import { CustomersReward } from './entities/customerRewards.entity';
import { CustomerNumber } from './entities/customerNumber.entity';
import { GeneratedRewardCode } from './entities/generateRewardCode.entity';
import { RewardCustomerNumber } from './entities/rewardCustomerNumber.entity';
import { CampaignService } from '../campaign/campaign.service';
import { VoucherService } from '../voucher/voucher.service';

describe('RewardService - Edit Reward Page Fields', () => {
  let service: RewardService;
  
  const mockRewardRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockDeps = {
      // Mock other dependencies to satisfy injection but not used in this specific test
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardService,
        { provide: getRepositoryToken(Reward), useValue: mockRewardRepo },
        { provide: getRepositoryToken(CodeGeneratedByStaffs), useValue: {} },
        { provide: getRepositoryToken(CustomerPoint), useValue: {} },
        { provide: getRepositoryToken(CustomerNumber), useValue: {} },
        { provide: getRepositoryToken(GeneratedRewardCode), useValue: {} },
        { provide: getRepositoryToken(CustomersReward), useValue: {} },
        { provide: getRepositoryToken(RewardCustomerNumber), useValue: {} },
        { provide: CampaignService, useValue: {} },
        { provide: VoucherService, useValue: {} },
      ],
    }).compile();

    service = module.get<RewardService>(RewardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a reward with success page fields', async () => {
    const user = new User();
    const createDto: CreateRewardDto = {
      title: 'Test Reward',
      pointCost: '100',
      currency: '$',
      rewardValue: '10',
      activeFrom: '2023-01-01',
      expires: '2023-12-31',
      successPageTitle: 'Congrats!',
      successPageMessage: 'You earned it.',
      successPageButtonLink: 'https://mysite.com/claim',
    };

    mockRewardRepo.create.mockImplementation((dto) => dto);
    mockRewardRepo.save.mockResolvedValue({ id: '1', ...createDto, user });

    const result = await service.create(createDto, user);

    expect(mockRewardRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      successPageTitle: 'Congrats!',
      successPageMessage: 'You earned it.',
      successPageButtonLink: 'https://mysite.com/claim',
    }));
    expect(result.successPageTitle).toBe('Congrats!');
  });

  it('should update a reward with success page fields', async () => {
    const existingReward = new Reward();
    existingReward.id = '1';
    existingReward.title = 'Old Title';
    
    const updateDto: UpdateRewardDto = {
      successPageTitle: 'Updated Congrats!',
      successPageMessage: 'Updated Message',
    };

    // Mock save to return the merged object (simulating what TypeORM/Service logic would do effectively)
    mockRewardRepo.save.mockImplementation(async (entity) => entity);

    const result = await service.update(existingReward, updateDto);

    expect(mockRewardRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      successPageTitle: 'Updated Congrats!',
      successPageMessage: 'Updated Message',
    }));
    expect(result.successPageTitle).toBe('Updated Congrats!');
  });
});
