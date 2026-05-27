export interface ActivityData {
    date: string;
    count: number;
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
