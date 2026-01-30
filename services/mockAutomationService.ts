
export interface ValidationResponse {
  success: boolean;
  reward?: {
    points: number;
    message: string;
    campaignName: string;
    customerName?: string;
    rewardPageTitle?: string;
    rewardPageMessage?: string;
  };
  error?: string;
}

export const mockAutomationService = {
  validateTrigger: async (code: string): Promise<ValidationResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Define valid codes for testing
    const validCodes: Record<string, {
      points: number;
      message: string;
      campaignName: string;
      customerName: string;
      rewardPageTitle?: string;
      rewardPageMessage?: string;
    }> = {
      'PROMO2026': {
        points: 500,
        message: 'Welcome Bonus!',
        campaignName: 'New Year Campaign',
        customerName: 'Dave1',
        rewardPageTitle: 'Custom Congratz!',
        rewardPageMessage: 'You just unlocked the custom reward page message!',
      },
      'SUMMER_FUN': {
        points: 100,
        message: 'Summer Vibes Reward',
        campaignName: 'Summer Sale',
        customerName: 'Alice',
      },
      'LOYALTY_GOLD': {
        points: 1000,
        message: 'Gold Member Perk',
        campaignName: 'VIP Club',
        customerName: 'Bob',
      },
    };

    if (code in validCodes) {
      return {
        success: true,
        reward: validCodes[code],
      };
    }

    return {
      success: false,
      error: 'Invalid or expired QR code.',
    };
  },
};
