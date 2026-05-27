import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeasonDto {
  @ApiProperty({ description: 'Season name', example: 'Holiday Season 2024' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ISO start date string', example: '2024-11-20T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'ISO end date string', example: '2025-01-05T23:59:59Z' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Business ID', example: 'business-uuid' })
  @IsNotEmpty()
  @IsString()
  businessId: string;
}
