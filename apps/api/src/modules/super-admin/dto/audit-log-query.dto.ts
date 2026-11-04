import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto.js';
import { SuperAdminAuditTargetType } from '../entities/super-admin-audit-log.entity.js';

export class AuditLogListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Only actions performed by this user' })
  @IsUUID()
  @IsOptional()
  actorId?: string;

  @ApiPropertyOptional({ enum: SuperAdminAuditTargetType })
  @IsEnum(SuperAdminAuditTargetType)
  @IsOptional()
  targetType?: SuperAdminAuditTargetType;

  @ApiPropertyOptional({ description: 'Only actions against this record' })
  @IsUUID()
  @IsOptional()
  targetId?: string;

  @ApiPropertyOptional({
    description: 'Only actions on or after this date',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'Only actions on or before this date',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  to?: string;
}
