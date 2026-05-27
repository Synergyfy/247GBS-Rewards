import { ApiProperty } from '@nestjs/swagger';
import { CustomersReward } from '../entities/customerRewards.entity';

export class RewardStatsResponseDto {
  @ApiProperty({ example: 150, description: 'Total number of times this reward has been redeemed' })
  totalRedeemed: number;

  @ApiProperty({ example: 120, description: 'Number of unique customers who redeemed this reward' })
  uniqueCustomers: number;

  @ApiProperty({ example: 120, description: 'Same as uniqueCustomers, explicitly requested' })
  totalUniqueUsers: number;

  @ApiProperty({ example: 5.5, description: 'Percentage of campaign customers who redeemed this reward' })
  avgConversionRate: number;

  @ApiProperty({ example: 15000, description: 'Total points spent on this reward' })
  totalPointsSpent: number;
}

export class RewardRedemptionMetaDto {
  @ApiProperty({ example: 50, description: 'Total number of records' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 5, description: 'Last page number' })
  last_page: number;
}

export class RewardRedemptionsResponseDto {
  @ApiProperty({ type: [CustomersReward], description: 'List of redemptions' })
  data: CustomersReward[];

  @ApiProperty({ type: RewardRedemptionMetaDto, description: 'Pagination metadata' })
  meta: RewardRedemptionMetaDto;
}
