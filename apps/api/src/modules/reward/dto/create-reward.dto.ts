import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ description: 'Title of the reward' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Point cost of the reward' })
  @IsString()
  @IsNotEmpty()
  pointCost: string;

  @ApiProperty({ description: 'The currency' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Value of the reward' })
  @IsString()
  @IsNotEmpty()
  rewardValue: string;

  @ApiProperty({ description: 'Active from date' })
  @IsString()
  @IsNotEmpty()
  activeFrom: string;

  @ApiProperty({ description: 'Expiration date' })
  @IsString()
  @IsNotEmpty()
  expires: string;

  @ApiProperty({ description: 'Description of the reward' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quantity available' })
  @IsNumber()
  @IsOptional()
  quantityAvailable?: number;

  @ApiProperty({ description: 'Type of reward' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Success Page Title' })
  @IsString()
  @IsOptional()
  successPageTitle?: string;

  @ApiProperty({ description: 'Success Page Message' })
  @IsString()
  @IsOptional()
  successPageMessage?: string;

  @ApiProperty({ description: 'Success Page Button Link' })
  @IsString()
  @IsOptional()
  successPageButtonLink?: string;

  @ApiProperty({ description: 'Configuration for reward' })
  @IsOptional()
  config?: Record<string, unknown>;
}
