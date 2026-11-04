import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto.js';

export class RedemptionListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by campaign' })
  @IsUUID()
  @IsOptional()
  campaignId?: string;

  @ApiPropertyOptional({
    description: 'Filter by customer membership id',
  })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Only redemptions on or after this date',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'Only redemptions on or before this date',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  to?: string;
}
