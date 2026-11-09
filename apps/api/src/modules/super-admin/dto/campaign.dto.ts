import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignType } from '../../../core/enums/campaignType.js';
import { PaginationQueryDto } from './pagination-query.dto.js';
import { toBoolean } from './user.dto.js';

export class CampaignListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Only campaigns belonging to this business',
    example: 'cbc5bf3f-b608-4b87-b4d0-ee457aac9573',
  })
  @IsUUID()
  @IsOptional()
  businessId?: string;

  @ApiPropertyOptional({
    description: 'Only campaigns of businesses owned by this user',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ enum: CampaignType })
  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @ApiPropertyOptional({
    description:
      'Filter by effective status (seasonal campaigns are only active inside their season)',
  })
  @Transform(toBoolean)
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class SetCampaignStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'Paused after a merchant request',
    description: 'Reason recorded in the audit log',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
