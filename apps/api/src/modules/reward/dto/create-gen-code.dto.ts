import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { RewardMethod } from '../../../core/enums/rewardMethod';
import { ApiProperty } from '@nestjs/swagger';

export enum ExpirationOption {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class CreateGenerateCodeDto {
  @ApiProperty({ description: 'Campaign ID' })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({ description: 'Type of code' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Points value' })
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @ApiProperty({ enum: ExpirationOption, description: 'Expiration option' })
  @IsEnum(ExpirationOption, {
    message: `expirationOption must be one of: ${Object.values(ExpirationOption).join(', ')}`,
  })
  expires: ExpirationOption;
}

export class CreateBulkPointCodesDto extends CreateGenerateCodeDto {
  @ApiProperty({ description: 'Number of codes to generate' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateGenerateRedeemCodeDto {
  @ApiProperty({ description: 'Campaign ID' })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({ description: 'Reward ID' })
  @IsString()
  @IsNotEmpty()
  rewardId: string;

  @ApiProperty({ enum: ExpirationOption, description: 'Expiration option' })
  @IsEnum(ExpirationOption, {
    message: `expirationOption must be one of: ${Object.values(ExpirationOption).join(', ')}`,
  })
  expires: ExpirationOption;
}

export class verifyCodeDto {
  @ApiProperty({ description: 'Campaign ID' })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({ description: 'Verification code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Type of code (1 or 2)', example: '1' })
  @IsString()
  @IsNotEmpty()
  type: '1' | '2';
}

export class CreateCustomerNumberDto {
  @ApiProperty({ description: 'Campaign ID' })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({ enum: RewardMethod, description: 'Reward Method' })
  @IsEnum(RewardMethod)
  @IsNotEmpty()
  type: RewardMethod;
}

export class ValidateCustomerNumberDto {
  @ApiProperty({ description: 'Customer Number' })
  @IsString()
  @IsNotEmpty()
  customerNumber: string;

  @ApiProperty({ description: 'Points to add/redeem' })
  @IsString()
  @IsNotEmpty()
  points: string;

  @ApiProperty({ enum: RewardMethod, description: 'Reward Method' })
  @IsEnum(RewardMethod)
  @IsNotEmpty()
  type: RewardMethod;
}

export class ValidateCustomerRedeemNumberDto {
  @ApiProperty({ description: 'Customer Number' })
  @IsString()
  @IsNotEmpty()
  customerNumber: string;

  @ApiProperty({ description: 'Reward ID' })
  @IsString()
  @IsNotEmpty()
  rewardId: string;

  @ApiProperty({ enum: RewardMethod, description: 'Reward Method' })
  @IsEnum(RewardMethod)
  @IsNotEmpty()
  type: RewardMethod;
}
