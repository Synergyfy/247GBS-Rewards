export type Role = 'super_admin' | 'admin' | 'staff' | 'customer';
export type SignupSource = 'mcom' | 'stock_audit';
export type CampaignType = 'PRESET' | 'CO_BRANDED' | 'SEASONAL';
export type RewardType = 'STANDARD' | 'LINK' | 'CREDENTIALS';
export type RewardMethod = 'QR' | 'CustomerNumber';

export interface Base { id: string; created_at: string; updated_at: string; }
export interface LoginResponse { accessToken: string; name: string; role: Role; }
export interface User extends Base {
  fullName: string; email: string; role: Role; phoneNumber: string; location: string | null;
  signupSource: SignupSource; isActive?: boolean; businesses?: Business[];
}
export interface Address extends Base { street: string; postalCode: string; city: string; state: string; }
export interface Socials extends Base {
  socialText: string; facebook: string | null; youtube: string | null; vimeo: string | null;
  whatsapp: string | null; instagram: string | null; x: string | null; linkedIn: string | null;
  tumblr: string | null; snapchat: string | null; pinterest: string | null; telegram: string | null; medium: string | null;
}
export interface Link extends Base { url: string; text: string; }
export interface Business extends Base {
  name: string; logo: string | null; email: string; phoneNumber: string; website: string | null;
  user?: User; address?: Address; socials?: Socials; links?: Link[]; campaigns?: Campaign[];
  staffs?: Staff[]; segments?: Segment[]; seasons?: Season[];
}
export interface Staff extends Base { name: string; email: string; avatar: string | null; isActive: boolean; business?: Business; }
export interface Segment extends Base { name: string; }
export interface Season extends Base { name: string; startDate: string; endDate: string; }
export interface Campaign extends Base {
  type: CampaignType; name: string; startDate: string | null; endDate: string | null;
  signupPoints: string; customDomain: string | null; uniqueCode: string;
  earnStaffScanQR: boolean; earnEnterCode: boolean; earnStaffPersonalCode: boolean; earnGiveStaffNumber: boolean;
  redeemStaffScanQR: boolean; redeemStaffPersonalCode: boolean; redeemGiveStaffNumber: boolean;
  homeTitle: string; homeText: string; headerImg: string | null;
  background: string; text: string; primaryBg: string; primaryText: string; secondaryBg: string; secondaryText: string;
  business?: Business; season?: Season | null; rewards?: Reward[]; isActive?: boolean;
}
export interface Reward extends Base {
  title: string; pointCost: string; currency: string; rewardValue: string; activeFrom: string; expires: string;
  description: string; type: RewardType; successPageTitle: string | null; successPageMessage: string | null;
  successPageButtonLink: string | null; config: Record<string, unknown> | null; quantityAvailable: number;
  quantityRemaining: number; campaign?: Campaign;
}
export interface Customer extends Base { firstName: string; lastName: string; email: string; campaign?: Campaign; balance?: number; }
export interface PointsLedgerEntry extends Base { points: number; description: string; campaign?: Campaign; customer?: Customer; }
export interface Redemption extends Base { description: string; uniqueCode: string; campaign?: Campaign; customer?: Customer; reward?: Reward; }
export interface GeneratedCode extends Base { expiry: string; points: number; code: string; type: string; staff?: Staff | null; }
export interface ActivityPoint { date: string; count: number; }
export interface UserAnalytics {
  totalCampaigns: number; activeCampaigns: number; inactiveCampaigns: number;
  totalCustomers: number; totalPointsIssued: number; totalRewardsRedeemed: number;
}
export interface CampaignAnalytics {
  campaignName: string; isActive: boolean; totalCustomers: number; totalPointsIssued: number;
  totalRewardsRedeemed: number; pointsActivity: ActivityPoint[]; rewardsActivity: ActivityPoint[];
}
export interface Paginated<T> { data: T[]; total: number; page: number; limit: number; }
export interface ListParams { page?: number; limit?: number; search?: string; sort?: string; order?: 'ASC' | 'DESC'; }
export interface UserRow extends User { businessCount: number; campaignCount: number; customerCount: number; }
export interface PlatformAnalytics {
  totals: {
    users: number; usersByRole: Record<Role, number>; usersBySignupSource: Record<SignupSource, number>;
    businesses: number; campaigns: number; activeCampaigns: number; customers: number;
    pointsIssued: number; pointsRedeemed: number; rewardsRedeemed: number;
  };
  series: { date: string; newUsers: number; newCustomers: number; pointsIssued: number; redemptions: number; }[];
  topBusinesses: { businessId: string; name: string; ownerName: string; customers: number; pointsIssued: number; }[];
}
export interface AuditLogEntry {
  id: string; created_at: string; actor: Pick<User, 'id' | 'fullName' | 'email'>;
  action: string; targetType: 'user' | 'business' | 'campaign' | 'staff' | 'customer' | 'code';
  targetId: string; payload: Record<string, unknown> | null; ip: string | null;
}
export interface ApiError { status: number; message: string; }
export interface UserListParams extends ListParams {
  role?: Role; signupSource?: SignupSource; isActive?: boolean; createdFrom?: string; createdTo?: string;
}
export interface BusinessListParams extends ListParams { userId?: string; }
export interface CampaignListParams extends ListParams { businessId?: string; type?: CampaignType; active?: boolean; }
export interface CustomerListParams extends ListParams { campaignId?: string; businessId?: string; }
export interface RedemptionListParams extends ListParams { campaignId?: string; customerId?: string; from?: string; to?: string; }
export interface AuditListParams extends ListParams { actorId?: string; targetType?: AuditLogEntry['targetType']; targetId?: string; from?: string; to?: string; }
export interface BusinessCreateInput { name: string; email: string; phoneNumber: string; website?: string; logo?: string; address?: Partial<Address>; socials?: Partial<Socials>; links?: Array<Pick<Link, 'url' | 'text'>>; }
export interface PointsAdjustmentInput { campaignId: string; points: number; reason: string; }
