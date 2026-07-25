export interface ActivityData {
    date: string;
    count: number;
}

export interface RewardStats {
  totalRedeemed: number;
  uniqueCustomers: number;
  totalUniqueUsers: number;
  avgConversionRate: number;
  totalPointsSpent: number;
}

export interface CampaignAnalytics {
    campaignName: string;
    isActive: boolean;
    totalCustomers: number;
    totalPointsIssued: number;
    totalRewardsRedeemed: number;
    pointsActivity: ActivityData[];
    rewardsActivity: ActivityData[];
}
