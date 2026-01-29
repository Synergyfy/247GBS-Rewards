
export interface ValidationResponse {
  success: boolean;
  reward?: {
    points: number;
    message: string;
    campaignName: string;
  };
  error?: string;
}

export const mockAutomationService = {
  validateTrigger: async (code: string): Promise<ValidationResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Define valid codes for testing
    const validCodes: Record<string, { points: number; message: string; campaignName: string }> = {
      'PROMO2026': {
        points: 500,
        message: 'Welcome Bonus!',
        campaignName: 'New Year Campaign',
      },
      'SUMMER_FUN': {
        points: 100,
        message: 'Summer Vibes Reward',
        campaignName: 'Summer Sale',
      },
      'LOYALTY_GOLD': {
        points: 1000,
        message: 'Gold Member Perk',
        campaignName: 'VIP Club',
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
