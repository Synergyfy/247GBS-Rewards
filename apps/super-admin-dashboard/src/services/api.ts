import type {
  AuditListParams, AuditLogEntry, Business, BusinessCreateInput, BusinessListParams,
  Campaign, CampaignAnalytics, CampaignListParams, Customer, CustomerListParams, LoginResponse,
  Paginated, PlatformAnalytics, PointsAdjustmentInput, PointsLedgerEntry,
  Redemption, RedemptionListParams, Staff, User, UserAnalytics, UserListParams, UserRow,
} from './types';
import type { ListParams } from './types';

export interface SuperAdminApi {
  login(email: string, password: string): Promise<LoginResponse>;
  listAdmins(params: ListParams): Promise<Paginated<UserRow>>;
  listUsers(params: UserListParams): Promise<Paginated<UserRow>>;
  getUser(id: string): Promise<User & { businesses: Business[] }>;
  updateUser(id: string, input: Partial<Pick<User, 'fullName' | 'email' | 'phoneNumber' | 'location' | 'role'>>): Promise<User>;
  setUserStatus(id: string, isActive: boolean, reason?: string): Promise<User>;
  resetPassword(id: string, reason: string): Promise<{ temporaryPassword: string }>;
  deleteUser(id: string, reason: string): Promise<{ success: true }>;
  listBusinesses(params: BusinessListParams): Promise<Paginated<Business>>;
  getBusiness(id: string): Promise<Business>;
  createBusiness(ownerId: string, input: BusinessCreateInput): Promise<Business>;
  updateBusiness(id: string, input: Partial<Business>): Promise<Business>;
  deleteBusiness(id: string, reason: string): Promise<{ success: true }>;
  businessStaff(id: string): Promise<Staff[]>;
  updateStaff(id: string, input: Partial<Pick<Staff, 'isActive' | 'name' | 'email'>>): Promise<Staff>;
  listCampaigns(params: CampaignListParams): Promise<Paginated<Campaign>>;
  getCampaign(id: string): Promise<Campaign>;
  setCampaignStatus(id: string, isActive: boolean, reason?: string): Promise<Campaign>;
  userAnalytics(id: string): Promise<UserAnalytics>;
  campaignAnalytics(id: string): Promise<CampaignAnalytics>;
  platformAnalytics(from?: string, to?: string): Promise<PlatformAnalytics>;
  listCustomers(params: CustomerListParams): Promise<Paginated<Customer>>;
  getCustomer(id: string): Promise<Customer & { balance: number; ledger: PointsLedgerEntry[]; redemptions: Redemption[] }>;
  adjustCustomerPoints(id: string, input: PointsAdjustmentInput): Promise<PointsLedgerEntry>;
  listRedemptions(params: RedemptionListParams): Promise<Paginated<Redemption>>;
  revokeCode(id: string): Promise<{ success: true }>;
  listAuditLogs(params: AuditListParams): Promise<Paginated<AuditLogEntry>>;
}
