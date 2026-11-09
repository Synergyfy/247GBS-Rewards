import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto.js';
import { PaginationMetaDto } from './response.dto.js';

export enum CampaignCodeKind {
  POINT_CODE = 'point_code',
  REWARD_CODE = 'reward_code',
  REWARD_NUMBER = 'reward_number',
  CUSTOMER_NUMBER = 'customer_number',
}

export class CampaignCodeListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: CampaignCodeKind,
    default: CampaignCodeKind.POINT_CODE,
    description:
      'point_code: staff-generated earn codes; reward_code: staff-generated redeem codes; reward_number / customer_number: numbers issued to customers',
  })
  @IsEnum(CampaignCodeKind)
  @IsOptional()
  kind?: CampaignCodeKind = CampaignCodeKind.POINT_CODE;
}

export class CampaignCodeRefDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  label: string;
}

export class CampaignCodeRowDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ enum: CampaignCodeKind })
  kind: CampaignCodeKind;

  @ApiProperty({ example: 'A1B2C3' })
  code: string;

  @ApiPropertyOptional({ nullable: true, description: 'Codes only' })
  expiry: Date | null;

  @ApiPropertyOptional({ nullable: true, description: 'Point codes only' })
  points: number | null;

  @ApiPropertyOptional({ type: CampaignCodeRefDto, nullable: true })
  staff: CampaignCodeRefDto | null;

  @ApiPropertyOptional({ type: CampaignCodeRefDto, nullable: true })
  customer: CampaignCodeRefDto | null;

  @ApiPropertyOptional({ type: CampaignCodeRefDto, nullable: true })
  reward: CampaignCodeRefDto | null;
}

export class PaginatedCampaignCodesResponseDto extends PaginationMetaDto {
  @ApiProperty({ type: () => [CampaignCodeRowDto] })
  data: CampaignCodeRowDto[];
}

export class RevokeCodeDto {
  @ApiPropertyOptional({
    example: 'Code shared publicly on social media',
    description: 'Reason recorded in the audit log',
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  reason?: string;
}
