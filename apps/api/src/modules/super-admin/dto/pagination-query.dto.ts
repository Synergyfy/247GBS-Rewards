import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: DEFAULT_PAGE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 25,
    minimum: 1,
    maximum: MAX_LIMIT,
    default: DEFAULT_LIMIT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  @IsOptional()
  limit?: number = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Free-text search term',
    example: 'maya',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by. Supported fields differ per endpoint.',
    example: 'created_at',
  })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'DESC';
}
