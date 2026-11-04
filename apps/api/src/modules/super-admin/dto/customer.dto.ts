import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  NotEquals,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto.js';

export class CustomerListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Only count memberships in this campaign',
  })
  @IsUUID()
  @IsOptional()
  campaignId?: string;

  @ApiPropertyOptional({
    description: 'Only count memberships in campaigns of this business',
  })
  @IsUUID()
  @IsOptional()
  businessId?: string;
}

export class PointsAdjustmentDto {
  @ApiProperty({
    description: 'Campaign the customer membership belongs to',
    example: 'cbc5bf3f-b608-4b87-b4d0-ee457aac9573',
  })
  @IsUUID()
  campaignId: string;

  @ApiProperty({
    description: 'Whole points to add (positive) or remove (negative)',
    example: 250,
  })
  @IsInt()
  @NotEquals(0)
  points: number;

  @ApiProperty({
    description: 'Reason recorded in the ledger and audit log',
    example: 'Goodwill adjustment for a failed scan',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  reason: string;
}
