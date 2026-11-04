import { IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto.js';

export class BusinessAddressDto {
  @ApiPropertyOptional({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({ example: '78701' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'Austin' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'TX' })
  @IsString()
  @IsOptional()
  state?: string;
}

export class BusinessSocialsDto {
  @ApiPropertyOptional({ example: 'Follow us for offers' })
  @IsString()
  @IsOptional()
  socialText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  youtube?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vimeo?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  x?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  linkedIn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tumblr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  snapchat?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pinterest?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  medium?: string;
}

export class BusinessLinkDto {
  @ApiProperty({ example: 'https://example.com/menu' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'Menu' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class BusinessListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Only businesses owned by this user',
    example: 'cbc5bf3f-b608-4b87-b4d0-ee457aac9573',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
