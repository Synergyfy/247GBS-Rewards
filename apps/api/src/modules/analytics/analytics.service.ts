import { Injectable } from '@nestjs/common';
import { CampaignService } from '../campaign/campaign.service';
import { CustomerService } from '../customer/customer.service';
import { RewardService } from '../reward/reward.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly customerService: CustomerService,
    private readonly rewardService: RewardService,
  ) {}

  async getPlatformAnalytics() {
    const campaigns = await this.campaignService.findAll(); // Need to ensure this exists or implement it
    // If findAll doesn't exist broadly, we might need a custom query or repo access
    // For now assuming we can get counts via repositories if services restrict us.
    // Let's use repositories directly for platform wide stats if services are scoped.
    return {
      message: "Platform analytics implementation pending repository access"
    }
  }

  async getOverallAnalytics(userId: string) {
    const campaigns = await this.campaignService.findAllByUser(userId);

    let totalCampaigns = campaigns.length;
    let totalCustomers = 0;
    let totalPointsIssued = 0;
    let totalRewardsRedeemed = 0;
    let activeCampaigns = 0;

    for (const campaign of campaigns) {
      if (this.campaignService.isCampaignActive(campaign)) {
        activeCampaigns++;
      }

      const customers = await this.customerService.findAllByCampaign(campaign.id);
      totalCustomers += customers.length;

      const pointsHistory = await this.rewardService.getCampaignPointHistory(campaign.id);
      const points = pointsHistory.reduce((acc, curr) => acc + curr.points, 0);
      totalPointsIssued += points;

      const rewardsHistory = await this.rewardService.getCampaignRewardHistory(campaign.id);
      totalRewardsRedeemed += rewardsHistory.length;
    }

    return {
      totalCampaigns,
      activeCampaigns,
      inactiveCampaigns: totalCampaigns - activeCampaigns,
      totalCustomers,
      totalPointsIssued,
      totalRewardsRedeemed,
    };
  }

  async getCampaignAnalytics(campaignId: string) {
    const campaign = await this.campaignService.findOne(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const customers = await this.customerService.findAllByCampaign(campaign.id);
    const pointsHistory = await this.rewardService.getCampaignPointHistory(campaign.id);
    const rewardsHistory = await this.rewardService.getCampaignRewardHistory(campaign.id);

    const totalPointsIssued = pointsHistory.reduce((acc, curr) => acc + curr.points, 0);
    const totalRewardsRedeemed = rewardsHistory.length;
    
    // Group points by date (last 7 days)
    const pointsByDate = this.groupDataByDate(pointsHistory, 'created_at');
    const rewardsByDate = this.groupDataByDate(rewardsHistory, 'created_at');

    return {
      campaignName: campaign.name,
      isActive: this.campaignService.isCampaignActive(campaign),
      totalCustomers: customers.length,
      totalPointsIssued,
      totalRewardsRedeemed,
      pointsActivity: pointsByDate,
      rewardsActivity: rewardsByDate,
    };
  }

  private groupDataByDate(data: any[], dateField: string) {
    const grouped = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        grouped[dateStr] = 0;
    }

    data.forEach(item => {
        const dateStr = new Date(item[dateField]).toISOString().split('T')[0];
        if (grouped[dateStr] !== undefined) {
            grouped[dateStr]++;
        }
    });

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }
}
