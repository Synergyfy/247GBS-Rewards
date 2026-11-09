import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { SuperAdminController } from './super-admin.controller.js';
import { SuperAdminService } from './super-admin.service.js';
import { ROLES_KEY } from '../../core/decorators/roles.decorator.js';
import { Role } from '../../core/enums/roles.js';

describe('SuperAdminController', () => {
  let controller: SuperAdminController;
  let service: Record<string, jest.Mock>;

  const request = {
    user: { userId: 'actor-id', role: Role.SUPER_ADMIN },
    ip: '127.0.0.1',
    headers: {},
  } as any;

  beforeEach(async () => {
    service = {
      listAdmins: jest.fn(),
      listUsers: jest.fn(),
      createUser: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      setUserStatus: jest.fn(),
      resetPassword: jest.fn(),
      deleteUser: jest.fn(),
      getAdminBusinesses: jest.fn(),
      createBusinessForUser: jest.fn(),
      listBusinesses: jest.fn(),
      getBusiness: jest.fn(),
      updateBusiness: jest.fn(),
      deleteBusiness: jest.fn(),
      businessStaff: jest.fn(),
      updateStaff: jest.fn(),
      listCampaigns: jest.fn(),
      getCampaign: jest.fn(),
      setCampaignStatus: jest.fn(),
      getPlatformAnalytics: jest.fn(),
      getUserAnalytics: jest.fn(),
      getCampaignAnalytics: jest.fn(),
      listCustomers: jest.fn(),
      getCustomer: jest.fn(),
      adjustCustomerPoints: jest.fn(),
      listRedemptions: jest.fn(),
      revokeCode: jest.fn(),
      listCampaignCodes: jest.fn(),
      getBusinessAnalytics: jest.fn(),
      listAuditLogs: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperAdminController],
      providers: [{ provide: SuperAdminService, useValue: service }],
    }).compile();

    controller = module.get(SuperAdminController);
  });

  it('is guarded to super admins only', () => {
    expect(Reflect.getMetadata(ROLES_KEY, SuperAdminController)).toEqual([
      Role.SUPER_ADMIN,
    ]);
  });

  it('lists admins', async () => {
    const query = { page: 1 };
    service.listAdmins.mockResolvedValue({ data: [], total: 0 });
    await controller.listAdmins(query as any);
    expect(service.listAdmins).toHaveBeenCalledWith(query);
  });

  it('lists users', async () => {
    const query = { page: 1 };
    service.listUsers.mockResolvedValue({ data: [], total: 0 });
    await controller.listUsers(query as any);
    expect(service.listUsers).toHaveBeenCalledWith(query);
  });

  it('creates a user', async () => {
    const dto = { fullName: 'A', email: 'a@b.com', phoneNumber: '1' };
    service.createUser.mockResolvedValue({ id: 'user-1' });
    await controller.createUser(dto as any, request);
    expect(service.createUser).toHaveBeenCalledWith(dto, 'actor-id', '127.0.0.1');
  });

  it('gets a user', async () => {
    service.getUser.mockResolvedValue({ id: 'user-1' });
    await controller.getUser({ id: 'user-1' });
    expect(service.getUser).toHaveBeenCalledWith('user-1');
  });

  it('updates a user', async () => {
    const dto = { location: 'Austin' };
    service.updateUser.mockResolvedValue({ id: 'user-1' });
    await controller.updateUser({ id: 'user-1' }, dto, request);
    expect(service.updateUser).toHaveBeenCalledWith(
      'user-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('sets user status', async () => {
    const dto = { isActive: false };
    service.setUserStatus.mockResolvedValue({ id: 'user-1' });
    await controller.setUserStatus({ id: 'user-1' }, dto, request);
    expect(service.setUserStatus).toHaveBeenCalledWith(
      'user-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('resets a password', async () => {
    const dto = { reason: 'support' };
    service.resetPassword.mockResolvedValue({ temporaryPassword: 'x' });
    await controller.resetPassword({ id: 'user-1' }, dto, request);
    expect(service.resetPassword).toHaveBeenCalledWith(
      'user-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('deletes a user', async () => {
    const dto = { reason: 'duplicate' };
    service.deleteUser.mockResolvedValue({ success: true });
    await controller.deleteUser({ id: 'user-1' }, dto, request);
    expect(service.deleteUser).toHaveBeenCalledWith(
      'user-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('lists an admin’s businesses', async () => {
    service.getAdminBusinesses.mockResolvedValue([]);
    await controller.getAdminBusinesses({ id: 'user-1' });
    expect(service.getAdminBusinesses).toHaveBeenCalledWith('user-1');
  });

  it('creates a business for a user', async () => {
    const dto = { name: 'B', email: 'b@c.com', phoneNumber: '1' };
    service.createBusinessForUser.mockResolvedValue({ id: 'biz-1' });
    await controller.createBusinessForUser({ userId: 'user-1' }, dto as any, request);
    expect(service.createBusinessForUser).toHaveBeenCalledWith(
      'user-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('lists businesses', async () => {
    const query = { page: 1 };
    service.listBusinesses.mockResolvedValue({ data: [], total: 0 });
    await controller.listBusinesses(query as any);
    expect(service.listBusinesses).toHaveBeenCalledWith(query);
  });

  it('gets a business', async () => {
    service.getBusiness.mockResolvedValue({ id: 'biz-1' });
    await controller.getBusiness({ id: 'biz-1' });
    expect(service.getBusiness).toHaveBeenCalledWith('biz-1');
  });

  it('updates a business', async () => {
    const dto = { name: 'New' };
    service.updateBusiness.mockResolvedValue({ id: 'biz-1' });
    await controller.updateBusiness({ id: 'biz-1' }, dto, request);
    expect(service.updateBusiness).toHaveBeenCalledWith(
      'biz-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('deletes a business', async () => {
    const dto = { reason: 'closed' };
    service.deleteBusiness.mockResolvedValue({ success: true });
    await controller.deleteBusiness({ id: 'biz-1' }, dto, request);
    expect(service.deleteBusiness).toHaveBeenCalledWith(
      'biz-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('lists business staff', async () => {
    service.businessStaff.mockResolvedValue([]);
    await controller.getBusinessStaff({ id: 'biz-1' });
    expect(service.businessStaff).toHaveBeenCalledWith('biz-1');
  });

  it('updates staff', async () => {
    const dto = { isActive: false };
    service.updateStaff.mockResolvedValue({ id: 'staff-1' });
    await controller.updateStaff({ id: 'staff-1' }, dto, request);
    expect(service.updateStaff).toHaveBeenCalledWith(
      'staff-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('lists campaigns', async () => {
    const query = { page: 1 };
    service.listCampaigns.mockResolvedValue({ data: [], total: 0 });
    await controller.listCampaigns(query as any);
    expect(service.listCampaigns).toHaveBeenCalledWith(query);
  });

  it('gets a campaign', async () => {
    service.getCampaign.mockResolvedValue({ id: 'campaign-1' });
    await controller.getCampaign({ id: 'campaign-1' });
    expect(service.getCampaign).toHaveBeenCalledWith('campaign-1');
  });

  it('sets campaign status', async () => {
    const dto = { isActive: false };
    service.setCampaignStatus.mockResolvedValue({ id: 'campaign-1' });
    await controller.setCampaignStatus({ id: 'campaign-1' }, dto, request);
    expect(service.setCampaignStatus).toHaveBeenCalledWith(
      'campaign-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('gets platform analytics', async () => {
    const query = { from: '2025-01-01', to: '2025-01-31' };
    service.getPlatformAnalytics.mockResolvedValue({ totals: {} });
    await controller.getPlatformAnalytics(query);
    expect(service.getPlatformAnalytics).toHaveBeenCalledWith(
      '2025-01-01',
      '2025-01-31',
    );
  });

  it('gets user analytics', async () => {
    service.getUserAnalytics.mockResolvedValue({});
    await controller.getUserAnalytics({ id: 'user-1' });
    expect(service.getUserAnalytics).toHaveBeenCalledWith('user-1');
  });

  it('gets campaign analytics', async () => {
    service.getCampaignAnalytics.mockResolvedValue({});
    await controller.getCampaignAnalytics({ id: 'campaign-1' });
    expect(service.getCampaignAnalytics).toHaveBeenCalledWith('campaign-1');
  });

  it('lists customers', async () => {
    const query = { page: 1 };
    service.listCustomers.mockResolvedValue({ data: [], total: 0 });
    await controller.listCustomers(query as any);
    expect(service.listCustomers).toHaveBeenCalledWith(query);
  });

  it('gets a customer', async () => {
    service.getCustomer.mockResolvedValue({ id: 'customer-1' });
    await controller.getCustomer({ id: 'customer-1' });
    expect(service.getCustomer).toHaveBeenCalledWith('customer-1');
  });

  it('adjusts customer points', async () => {
    const dto = { campaignId: 'campaign-1', points: 10, reason: 'fix' };
    service.adjustCustomerPoints.mockResolvedValue({ id: 'point-1' });
    await controller.adjustCustomerPoints({ id: 'customer-1' }, dto, request);
    expect(service.adjustCustomerPoints).toHaveBeenCalledWith(
      'customer-1',
      dto,
      'actor-id',
      '127.0.0.1',
    );
  });

  it('lists redemptions', async () => {
    const query = { page: 1 };
    service.listRedemptions.mockResolvedValue({ data: [], total: 0 });
    await controller.listRedemptions(query as any);
    expect(service.listRedemptions).toHaveBeenCalledWith(query);
  });

  it('revokes a code', async () => {
    service.revokeCode.mockResolvedValue({ success: true });
    await controller.revokeCode(
      { id: 'code-1' },
      { reason: 'Leaked code' },
      request,
    );
    expect(service.revokeCode).toHaveBeenCalledWith(
      'code-1',
      'actor-id',
      '127.0.0.1',
      'Leaked code',
    );
  });

  it('returns business analytics', async () => {
    service.getBusinessAnalytics.mockResolvedValue({ totalCampaigns: 1 });
    await expect(
      controller.getBusinessAnalytics({ id: 'business-1' }),
    ).resolves.toEqual({ totalCampaigns: 1 });
    expect(service.getBusinessAnalytics).toHaveBeenCalledWith('business-1');
  });

  it('lists the codes issued in a campaign', async () => {
    const query = { kind: 'reward_code', page: 1 };
    service.listCampaignCodes.mockResolvedValue({ data: [], total: 0 });
    await controller.listCampaignCodes({ id: 'campaign-1' }, query as any);
    expect(service.listCampaignCodes).toHaveBeenCalledWith('campaign-1', query);
  });

  it('lists audit logs', async () => {
    const query = { page: 1 };
    service.listAuditLogs.mockResolvedValue({ data: [], total: 0 });
    await controller.listAuditLogs(query as any);
    expect(service.listAuditLogs).toHaveBeenCalledWith(query);
  });
});
