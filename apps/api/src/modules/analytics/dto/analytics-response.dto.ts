import { ApiProperty } from '@nestjs/swagger';

export class OverallAnalyticsResponseDto {
  @ApiProperty()
  totalCampaigns: number;

  @ApiProperty()
  activeCampaigns: number;

  @ApiProperty()
  inactiveCampaigns: number;

  @ApiProperty()
  totalCustomers: number;

  @ApiProperty()
  totalPointsIssued: number;

  @ApiProperty()
  totalRewardsRedeemed: number;
}

export class ActivityDataPoint {
  @ApiProperty()
  date: string;

  @ApiProperty()
  count: number;
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

  @ApiProperty({ type: [ActivityDataPoint] })
  pointsActivity: ActivityDataPoint[];

  @ApiProperty({ type: [ActivityDataPoint] })
  rewardsActivity: ActivityDataPoint[];
}
