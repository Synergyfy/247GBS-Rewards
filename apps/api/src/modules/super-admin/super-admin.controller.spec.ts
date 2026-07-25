import { Test, TestingModule } from '@nestjs/testing';
import { SuperAdminController } from './super-admin.controller';
import { UserService } from '../user/user.service';
import { BusinessService } from '../business/business.service';
import { StaffService } from '../staff/staff.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CampaignService } from '../campaign/campaign.service';
import { Role } from '../../core/enums/roles';

describe('SuperAdminController', () => {
  let controller: SuperAdminController;
  let userService: UserService;
  let businessService: BusinessService;
  let staffService: StaffService;
  let analyticsService: AnalyticsService;

  const mockUserService = {
    findAllAdmins: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockBusinessService = {
    findAllBusinessByUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockStaffService = {
    findStaffByBusiness: jest.fn(),
  };

  const mockAnalyticsService = {
    getOverallAnalytics: jest.fn(),
    getPlatformAnalytics: jest.fn(),
    getCampaignAnalytics: jest.fn(),
  };

  const mockCampaignService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperAdminController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: BusinessService, useValue: mockBusinessService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: CampaignService, useValue: mockCampaignService },
      ],
    }).compile();

    controller = module.get<SuperAdminController>(SuperAdminController);
    userService = module.get<UserService>(UserService);
    businessService = module.get<BusinessService>(BusinessService);
    staffService = module.get<StaffService>(StaffService);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllAdmins', () => {
    it('should return all admins', async () => {
      const result = [{ id: '1', role: Role.ADMIN }];
      mockUserService.findAllAdmins.mockResolvedValue(result);

      expect(await controller.getAllAdmins()).toBe(result);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const result = [{ id: '1', role: Role.CUSTOMER }];
      mockUserService.findAll.mockResolvedValue(result);

      expect(await controller.getAllUsers()).toBe(result);
    });
  });

  describe('getAdminBusinesses', () => {
    it('should return businesses for an admin', async () => {
      const result = [{ id: 'biz1' }];
      mockBusinessService.findAllBusinessByUser.mockResolvedValue(result);

      expect(await controller.getAdminBusinesses('adminId')).toBe(result);
      expect(mockBusinessService.findAllBusinessByUser).toHaveBeenCalledWith('adminId');
    });
  });

  describe('getBusinessStaff', () => {
    it('should return staff for a business', async () => {
      const result = [{ id: 'staff1' }];
      mockStaffService.findStaffByBusiness.mockResolvedValue(result);

      expect(await controller.getBusinessStaff('bizId')).toBe(result);
      expect(mockStaffService.findStaffByBusiness).toHaveBeenCalledWith('bizId');
    });
  });

  describe('getUserAnalytics', () => {
    it('should return analytics for a user', async () => {
      const result = { totalCampaigns: 5 };
      mockAnalyticsService.getOverallAnalytics.mockResolvedValue(result);

      expect(await controller.getUserAnalytics('userId')).toBe(result);
      expect(mockAnalyticsService.getOverallAnalytics).toHaveBeenCalledWith('userId');
    });
  });

  describe('getPlatformAnalytics', () => {
    it('should return platform analytics', async () => {
      const result = { totalCampaigns: 100 };
      mockAnalyticsService.getPlatformAnalytics.mockResolvedValue(result);

      expect(await controller.getPlatformAnalytics()).toBe(result);
    });
  });

  describe('management endpoints', () => {
     it('should create a user', async () => {
         const dto = { email: 'test@test.com', password: 'pw', fullName: 'Test', phoneNumber: '123' };
         mockUserService.create.mockResolvedValue({ id: '1', ...dto });
         expect(await controller.createUser(dto as any)).toBeDefined();
         expect(mockUserService.create).toHaveBeenCalledWith(dto);
     });

     it('should create a business for user', async () => {
         const userId = 'uid';
         const dto = { name: 'Biz' };
         const user = { id: userId };
         mockUserService.findOne.mockResolvedValue(user);
         mockBusinessService.create.mockResolvedValue({ id: 'bid', ...dto });

         expect(await controller.createBusinessForUser(userId, dto as any)).toBeDefined();
         expect(mockBusinessService.create).toHaveBeenCalledWith(dto, user);
     });
     
     it('should update a business', async () => {
         const bid = 'bid';
         const dto = { name: 'New Name' };
         const existingBiz = { id: bid, user: { id: 'uid' } };
         const owner = { id: 'uid' };
         
         mockBusinessService.findOne.mockResolvedValue(existingBiz);
         mockUserService.findOne.mockResolvedValue(owner);
         mockBusinessService.update.mockResolvedValue({ ...existingBiz, ...dto });

         expect(await controller.updateBusiness(bid, dto as any)).toBeDefined();
         expect(mockBusinessService.update).toHaveBeenCalledWith(bid, dto, owner);
     });

     it('should delete a business', async () => {
         const bid = 'bid';
         mockBusinessService.remove.mockResolvedValue(undefined);
         await controller.deleteBusiness(bid);
         expect(mockBusinessService.remove).toHaveBeenCalledWith(bid);
     });
  });
});
