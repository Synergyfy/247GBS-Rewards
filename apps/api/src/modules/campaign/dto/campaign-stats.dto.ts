import { ApiProperty } from '@nestjs/swagger';
import { CustomersReward } from '../../reward/entities/customerRewards.entity';
import { Customer } from '../../customer/entities/customer.entity';

export class CampaignStatsResponseDto {
  @ApiProperty({ example: 300, description: 'Total number of redemptions in this campaign' })
  totalRedeemed: number;

  @ApiProperty({ example: 500, description: 'Total number of customers who joined this campaign' })
  totalCustomers: number;

  @ApiProperty({ example: 5000, description: 'Total points issued in this campaign' })
  totalPointsIssued: number;
}

export class CampaignRedemptionMetaDto {
  @ApiProperty({ example: 100, description: 'Total number of records' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Last page number' })
  last_page: number;
}

export class CampaignCustomerStatsDto {
  @ApiProperty({ example: 12.5, description: 'Percentage of customers who have redeemed at least one reward' })
  avgConversionRate: number;

  @ApiProperty({ example: 500, description: 'Total unique users joined the campaign' })
  totalUniqueUsers: number;
}

export class CampaignCustomersResponseDto {
  @ApiProperty({ type: [Customer], description: 'List of customers' })
  data: Customer[];

  @ApiProperty({ type: CampaignRedemptionMetaDto, description: 'Pagination metadata' })
  meta: CampaignRedemptionMetaDto;

  @ApiProperty({ type: CampaignCustomerStatsDto, description: 'Additional customer statistics' })
  statistics: CampaignCustomerStatsDto;
}

export class CampaignRedemptionsResponseDto {
  @ApiProperty({ type: [CustomersReward], description: 'List of redemptions' })
  data: CustomersReward[];

  @ApiProperty({ type: CampaignRedemptionMetaDto, description: 'Pagination metadata' })
  meta: CampaignRedemptionMetaDto;
}