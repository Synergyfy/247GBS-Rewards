import { Test, TestingModule } from '@nestjs/testing';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { UserService } from '../user/user.service';
import { StaffService } from '../staff/staff.service';
import { CampaignService } from '../campaign/campaign.service';
import { CustomerService } from '../customer/customer.service';
import { CreateBulkPointCodesDto } from './dto/create-gen-code.dto';
import { NotFoundException } from '@nestjs/common';

describe('RewardController', () => {
  let controller: RewardController;
  let rewardService: RewardService;
  let userService: UserService;
  let staffService: StaffService;
  let campaignService: CampaignService;

  const mockRewardService = {
    generateBulkCodes: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockStaffService = {
    findOne: jest.fn(),
  };

  const mockCampaignService = {
    findOne: jest.fn(),
    isCampaignActive: jest.fn(),
  };

  const mockCustomerService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardController],
      providers: [
        { provide: RewardService, useValue: mockRewardService },
        { provide: UserService, useValue: mockUserService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: CampaignService, useValue: mockCampaignService },
        { provide: CustomerService, useValue: mockCustomerService },
      ],
    }).compile();

    controller = module.get<RewardController>(RewardController);
    rewardService = module.get<RewardService>(RewardService);
    userService = module.get<UserService>(UserService);
    staffService = module.get<StaffService>(StaffService);
    campaignService = module.get<CampaignService>(CampaignService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGenerateBulkCodes', () => {
    it('should allow admin (User) to generate bulk codes when staff not found', async () => {
      const userId = 'user-id';
      const campaignId = 'campaign-id';
      const dto: CreateBulkPointCodesDto = {
        campaignId,
        points: 10,
        quantity: 5,
        expires: 'day' as any,
        type: '1',
      };
      const req = { user: { userId } };

      // Mock StaffService.findOne to throw NotFoundException
      mockStaffService.findOne.mockRejectedValue(new NotFoundException());
      
      // Mock UserService.findOne to return a user
      const mockUser = { id: userId, email: 'admin@example.com' };
      mockUserService.findOne.mockResolvedValue(mockUser);

      // Mock CampaignService
      const mockCampaign = { id: campaignId };
      mockCampaignService.findOne.mockResolvedValue(mockCampaign);
      mockCampaignService.isCampaignActive.mockReturnValue(true);

      await controller.createGenerateBulkCodes(req, dto);

      expect(staffService.findOne).toHaveBeenCalledWith(userId);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(rewardService.generateBulkCodes).toHaveBeenCalledWith(
        mockCampaign,
        mockUser,
        dto.points,
        dto.quantity,
        dto.expires,
        dto.type,
      );
    });

    it('should allow staff to generate bulk codes', async () => {
      const userId = 'staff-id';
      const campaignId = 'campaign-id';
      const dto: CreateBulkPointCodesDto = {
        campaignId,
        points: 10,
        quantity: 5,
        expires: 'day' as any,
        type: '1',
      };
      const req = { user: { userId } };

      // Mock StaffService.findOne to return a staff
      const mockStaff = { id: userId, email: 'staff@example.com' };
      mockStaffService.findOne.mockResolvedValue(mockStaff);

      // Mock CampaignService
      const mockCampaign = { id: campaignId };
      mockCampaignService.findOne.mockResolvedValue(mockCampaign);
      mockCampaignService.isCampaignActive.mockReturnValue(true);

      await controller.createGenerateBulkCodes(req, dto);

      expect(staffService.findOne).toHaveBeenCalledWith(userId);
      expect(userService.findOne).not.toHaveBeenCalled();
      expect(rewardService.generateBulkCodes).toHaveBeenCalledWith(
        mockCampaign,
        mockStaff,
        dto.points,
        dto.quantity,
        dto.expires,
        dto.type,
      );
    });
  });
});