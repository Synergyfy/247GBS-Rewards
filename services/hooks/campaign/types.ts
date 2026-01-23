import { BusinessType } from '@/app/interfaces/business.type';
import { RewardType } from '../reward/types';

export interface CampaignType {
  id?: string;
  businessId: string;
  rewardIds: string[];
  name: string;
  signupPoints: string;
  customDomain: string;
  type: 'PRESET' | 'SEASONAL' | 'CO_BRANDED';
  seasonId?: string;

  // Earn point settings
  earnStaffScanQR: boolean;
  earnEnterCode: boolean;
  earnStaffPersonalCode: boolean;
  earnGiveStaffNumber: boolean;

  // Redeem point settings
  redeemStaffScanQR: boolean;
  redeemStaffPersonalCode: boolean;
  redeemGiveStaffNumber: boolean;

  // Top bar content
  topTitle?: string;
  topHeadline?: string;

  // Home section
  homeTitle: string;
  homeText: string;
  headerImg?: string;

  // Columns section
  columnsTitle?: string;
  col1Title?: string;
  col1Text?: string;
  col1Img?: string;
  col2Title?: string;
  col2Text?: string;
  col2Img?: string;
  col3Title?: string;
  col3Text?: string;
  col3Img?: string;

  // Earn section
  earnTitle: string;
  earnText: string;
  earnImg?: string;

  // Redeem section
  redeemTitle: string;
  redeemText: string;
  redeemImg?: string;

  // Contact section
  contactTitle: string;
  contactText: string;
  contactImg?: string;

  // Colors
  background: string;
  text: string;
  primaryBg: string;
  primaryText: string;
  secondaryBg: string;
  secondaryText: string;

  // Mobile colors
  mobileNavBg: string;
  mobileNavText: string;
  mobileNavActiveBg: string;
  mobileNavActiveText: string;

  business?: BusinessType;
  rewards?: RewardType[];

  uniqueCode?: string;
  bannerUrl?: string;
  logoUrl?: string;
  audienceType?: string;
  campaignMessage?: string;
  startDate?: string;
  endDate?: string;
  contactPhoneNumber?: string;
  contactEmail?: string;
}
