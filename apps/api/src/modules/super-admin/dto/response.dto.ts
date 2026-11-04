import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity.js';
import { Business } from '../../business/entities/business.entity.js';
import { Campaign } from '../../campaign/entities/campaign.entity.js';
import { CustomerPoint } from '../../reward/entities/customerPoints.entity.js';
import { CustomersReward } from '../../reward/entities/customerRewards.entity.js';
import { SuperAdminAuditLog } from '../entities/super-admin-audit-log.entity.js';

export class PaginationMetaDto {
  @ApiProperty({ example: 120 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 25 })
  limit: number;
}

export class UserRowResponseDto extends User {
  @ApiProperty({ example: 2 })
  businessCount: number;

  @ApiProperty({ example: 6 })
  campaignCount: number;

  @ApiProperty({ example: 340 })
  customerCount: number;
}

export class UserWithBusinessesResponseDto extends User {}

export class PaginatedAdminsResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [UserRowResponseDto] })
  data: UserRowResponseDto[];
}

export class PaginatedUsersResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [UserRowResponseDto] })
  data: UserRowResponseDto[];
}

export class PaginatedBusinessesResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [Business] })
  data: Business[];
}

export class PaginatedCampaignsResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [Campaign] })
  data: Campaign[];
}

export class CustomerMembershipResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ example: 1200 })
  balance: number;

  @ApiPropertyOptional({ type: () => Campaign })
  campaign?: Campaign;
}

export class CustomerRowResponseDto {
  @ApiProperty({ description: 'Membership id used to open the person page' })
  id: string;

  @ApiProperty({ example: 'Sam' })
  firstName: string;

  @ApiProperty({ example: 'Foster' })
  lastName: string;

  @ApiProperty({ example: 'sam.foster@example.com' })
  email: string;

  @ApiProperty({ description: 'Earliest join within the requested scope' })
  created_at: Date;

  @ApiProperty({ description: 'Sum of balances across the returned memberships' })
  balance: number;

  @ApiProperty()
  campaignCount: number;

  @ApiProperty({ type: () => [CustomerMembershipResponseDto] })
  memberships: CustomerMembershipResponseDto[];
}

export class CustomerProfileResponseDto extends CustomerRowResponseDto {
  @ApiProperty({ type: () => [CustomerPoint] })
  ledger: CustomerPoint[];

  @ApiProperty({ type: () => [CustomersReward] })
  redemptions: CustomersReward[];
}

export class PaginatedCustomersResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [CustomerRowResponseDto] })
  data: CustomerRowResponseDto[];
}

export class PaginatedRedemptionsResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [CustomersReward] })
  data: CustomersReward[];
}

export class PaginatedAuditLogsResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [SuperAdminAuditLog] })
  data: SuperAdminAuditLog[];
}

export class ActivityPointResponseDto {
  @ApiProperty({ example: '2025-08-01' })
  date: string;

  @ApiProperty({ example: 42 })
  count: number;
}

export class UserAnalyticsResponseDto {
  @ApiProperty({ example: 6 })
  totalCampaigns: number;

  @ApiProperty({ example: 4 })
  activeCampaigns: number;

  @ApiProperty({ example: 2 })
  inactiveCampaigns: number;

  @ApiProperty({ example: 340 })
  totalCustomers: number;

  @ApiProperty({ example: 12400 })
  totalPointsIssued: number;

  @ApiProperty({ example: 96 })
  totalRewardsRedeemed: number;
}

export class CampaignAnalyticsResponseDto {
  @ApiProperty()
  campaignName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  totalCustomers: number;

  @ApiProperty()
  totalPointsIssued: number;

  @ApiProperty()
  totalRewardsRedeemed: number;

  @ApiProperty({ type: () => [ActivityPointResponseDto] })
  pointsActivity: ActivityPointResponseDto[];

  @ApiProperty({ type: () => [ActivityPointResponseDto] })
  rewardsActivity: ActivityPointResponseDto[];
}

export class PlatformTotalsResponseDto {
  @ApiProperty({ example: 25 })
  users: number;

  @ApiProperty({
    example: { super_admin: 1, admin: 20, staff: 58, customer: 1400 },
    description: 'User count per role',
  })
  usersByRole: Record<string, number>;

  @ApiProperty({
    example: { mcom: 20, stock_audit: 5 },
  })
  usersBySignupSource: Record<string, number>;

  @ApiProperty()
  businesses: number;

  @ApiProperty()
  campaigns: number;

  @ApiProperty()
  activeCampaigns: number;

  @ApiProperty()
  customers: number;

  @ApiProperty()
  pointsIssued: number;

  @ApiProperty()
  pointsRedeemed: number;

  @ApiProperty()
  rewardsRedeemed: number;
}

export class PlatformSeriesPointDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  newUsers: number;

  @ApiProperty()
  newCustomers: number;

  @ApiProperty()
  pointsIssued: number;

  @ApiProperty()
  redemptions: number;
}

export class TopBusinessResponseDto {
  @ApiProperty()
  businessId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  customers: number;

  @ApiProperty()
  pointsIssued: number;
}

export class PlatformAnalyticsResponseDto {
  @ApiProperty({ type: () => PlatformTotalsResponseDto })
  totals: PlatformTotalsResponseDto;

  @ApiProperty({ type: () => [PlatformSeriesPointDto] })
  series: PlatformSeriesPointDto[];

  @ApiProperty({ type: () => [TopBusinessResponseDto] })
  topBusinesses: TopBusinessResponseDto[];
}

export class TemporaryPasswordResponseDto {
  @ApiProperty({ example: 'GBS-7K2QAB-9XZ1' })
  temporaryPassword: string;
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;
}
