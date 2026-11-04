import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsRangeQueryDto {
  @ApiPropertyOptional({
    description: 'Start of the reporting window (inclusive)',
    example: '2025-08-01',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'End of the reporting window (inclusive)',
    example: '2025-08-31',
  })
  @IsDateString()
  @IsOptional()
  to?: string;
}
