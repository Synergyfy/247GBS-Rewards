// campaign.dto.ts
import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { Business } from '../../../modules/business/entities/business.entity';
import { Reward } from '../../../modules/reward/entities/reward.entity';
import { CampaignType } from '../../../core/enums/campaignType';
import { Season } from '../entities/season.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ description: 'ID of the business owning the campaign', example: 'uuid-string' })
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ description: 'Array of reward IDs associated with the campaign', example: ['reward-id-1', 'reward-id-2'] })
  @IsNotEmpty()
  rewardIds: string[];

  @ApiProperty({ enum: CampaignType, required: false, default: CampaignType.PRESET })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType = CampaignType.PRESET;

  @ApiProperty({ required: false, description: 'ID of the season (if any)', example: 'season-uuid-string' })
  @IsString()
  @IsOptional()
  seasonId?: string;

  @ApiProperty({ description: 'Name of the campaign', example: 'Spring Loyalty Program' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Start date of the campaign (ISO string)', example: '2024-03-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date of the campaign (ISO string)', example: '2024-05-31T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Points awarded for signing up', example: '50' })
  @IsString()
  @IsNotEmpty()
  signupPoints: string;

  @ApiProperty({ required: false, description: 'Custom domain for the campaign profile', example: 'loyalty.mybusiness.com' })
  @IsString()
  @IsOptional()
  customDomain?: string;

  // Earn point settings
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  earnStaffScanQR?: boolean = true;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  earnEnterCode?: boolean = true;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  earnStaffPersonalCode?: boolean = true;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  earnGiveStaffNumber?: boolean = true;

  // Redeem point settings
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  redeemStaffScanQR?: boolean = true;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  redeemStaffPersonalCode?: boolean = true;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  redeemGiveStaffNumber?: boolean = true;

  // Top bar content
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  topTitle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  topHeadline?: string;

  // Home section
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  homeTitle?: string = 'Welcome to our new loyalty program';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  homeText?: string =
    'This new way of saving is our biggest and best savings program ever.';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  headerImg?: string;

  // Columns section
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  columnsTitle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col1Title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col1Text?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col1Img?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col2Title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col2Text?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col2Img?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col3Title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col3Text?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  col3Img?: string;

  // Earn section
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  earnTitle?: string = 'Earn Points';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  earnText?: string = 'Get points for every dollar you spend.';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  earnImg?: string;

  // Redeem section
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  redeemTitle?: string = 'Rewards';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  redeemText?: string = 'Earn points and choose from these rewards.';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  redeemImg?: string;

  // Contact section
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactTitle?: string = 'Contact Us';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactText?: string = 'Get in touch.';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  contactImg?: string;

  // Colors
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  background?: string = '#EEEEEE';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text?: string = '#333333';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  primaryBg?: string = '#111111';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  primaryText?: string = '#ffffff';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  secondaryBg?: string = '#0D47A1';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  secondaryText?: string = '#ffffff';

  // Mobile colors
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mobileNavBg?: string = '#0D47A1';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mobileNavText?: string = '#ffffff';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mobileNavActiveBg?: string = '#0D47A1';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mobileNavActiveText?: string = '#ffffff';
}

export class CampaignPayload {
  @ApiProperty({ type: () => Business })
  @IsNotEmpty()
  business: Business;

  @ApiProperty({ type: () => [Reward] })
  @IsNotEmpty()
  rewards: Reward[];

  @ApiProperty({ enum: CampaignType, required: false })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @ApiProperty({ type: () => Season, required: false })
  @IsOptional()
  season?: Season;

  @ApiProperty({ description: 'Campaign name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ISO start date string' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'ISO end date string' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Signup points value' })
  @IsString()
  @IsNotEmpty()
  signupPoints: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  customDomain?: string;

  // Earn point settings
  @IsBoolean()
  @IsOptional()
  earnStaffScanQR?: boolean = true;

  @IsBoolean()
  @IsOptional()
  earnEnterCode?: boolean = true;

  @IsBoolean()
  @IsOptional()
  earnStaffPersonalCode?: boolean = true;

  @IsBoolean()
  @IsOptional()
  earnGiveStaffNumber?: boolean = true;

  // Redeem point settings
  @IsBoolean()
  @IsOptional()
  redeemStaffScanQR?: boolean = true;

  @IsBoolean()
  @IsOptional()
  redeemStaffPersonalCode?: boolean = true;

  @IsBoolean()
  @IsOptional()
  redeemGiveStaffNumber?: boolean = true;

  // Top bar content
  @IsString()
  @IsOptional()
  topTitle?: string;

  @IsString()
  @IsOptional()
  topHeadline?: string;

  // Home section
  @IsString()
  @IsOptional()
  homeTitle?: string = 'Welcome to our new loyalty program';

  @IsString()
  @IsOptional()
  homeText?: string =
    'This new way of saving is our biggest and best savings program ever.';

  @IsString()
  @IsOptional()
  headerImg?: string;

  // Columns section
  @IsString()
  @IsOptional()
  columnsTitle?: string;

  @IsString()
  @IsOptional()
  col1Title?: string;

  @IsString()
  @IsOptional()
  col1Text?: string;

  @IsString()
  @IsOptional()
  col1Img?: string;

  @IsString()
  @IsOptional()
  col2Title?: string;

  @IsString()
  @IsOptional()
  col2Text?: string;

  @IsString()
  @IsOptional()
  col2Img?: string;

  @IsString()
  @IsOptional()
  col3Title?: string;

  @IsString()
  @IsOptional()
  col3Text?: string;

  @IsString()
  @IsOptional()
  col3Img?: string;

  // Earn section
  @IsString()
  @IsOptional()
  earnTitle?: string = 'Earn Points';

  @IsString()
  @IsOptional()
  earnText?: string = 'Get points for every dollar you spend.';

  @IsString()
  @IsOptional()
  earnImg?: string;

  // Redeem section
  @IsString()
  @IsOptional()
  redeemTitle?: string = 'Rewards';

  @IsString()
  @IsOptional()
  redeemText?: string = 'Earn points and choose from these rewards.';

  @IsString()
  @IsOptional()
  redeemImg?: string;

  // Contact section
  @IsString()
  @IsOptional()
  contactTitle?: string = 'Contact Us';

  @IsString()
  @IsOptional()
  contactText?: string = 'Get in touch.';

  @IsString()
  @IsOptional()
  contactImg?: string;

  // Colors
  @IsString()
  @IsOptional()
  background?: string = '#EEEEEE';

  @IsString()
  @IsOptional()
  text?: string = '#333333';

  @IsString()
  @IsOptional()
  primaryBg?: string = '#111111';

  @IsString()
  @IsOptional()
  primaryText?: string = '#ffffff';

  @IsString()
  @IsOptional()
  secondaryBg?: string = '#0D47A1';

  @IsString()
  @IsOptional()
  secondaryText?: string = '#ffffff';

  // Mobile colors
  @IsString()
  @IsOptional()
  mobileNavBg?: string = '#0D47A1';

  @IsString()
  @IsOptional()
  mobileNavText?: string = '#ffffff';

  @IsString()
  @IsOptional()
  mobileNavActiveBg?: string = '#0D47A1';

  @IsString()
  @IsOptional()
  mobileNavActiveText?: string = '#ffffff';
}
