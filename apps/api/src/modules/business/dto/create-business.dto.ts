import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateAddressDto {
  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Postal code', example: '12345' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: 'City', example: 'Anytown' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State', example: 'Anystate' })
  @IsString()
  @IsNotEmpty()
  state: string;
}

class CreateSocialDto {
  @ApiProperty({
    description: 'Social text',
    example: 'Follow us on social media',
  })
  @IsString()
  @IsOptional()
  socialText?: string;

  @ApiPropertyOptional({
    description: 'Facebook URL',
    example: 'https://facebook.com/mybusiness',
  })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({
    description: 'YouTube URL',
    example: 'https://youtube.com/mybusiness',
  })
  @IsOptional()
  @IsString()
  youtube?: string;

  @ApiPropertyOptional({
    description: 'Vimeo URL',
    example: 'https://vimeo.com/mybusiness',
  })
  @IsOptional()
  @IsString()
  vimeo?: string;

  @ApiPropertyOptional({
    description: 'WhatsApp URL',
    example: 'https://wa.me/1234567890',
  })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({
    description: 'Instagram URL',
    example: 'https://instagram.com/mybusiness',
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({
    description: 'X (formerly Twitter) URL',
    example: 'https://x.com/mybusiness',
  })
  @IsOptional()
  @IsString()
  x?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn URL',
    example: 'https://linkedin.com/company/mybusiness',
  })
  @IsOptional()
  @IsString()
  linkedIn?: string;

  @ApiPropertyOptional({
    description: 'Tumblr URL',
    example: 'https://mybusiness.tumblr.com',
  })
  @IsOptional()
  @IsString()
  tumblr?: string;

  @ApiPropertyOptional({
    description: 'Snapchat URL',
    example: 'https://snapchat.com/add/mybusiness',
  })
  @IsOptional()
  @IsString()
  snapchat?: string;

  @ApiPropertyOptional({
    description: 'Pinterest URL',
    example: 'https://pinterest.com/mybusiness',
  })
  @IsOptional()
  @IsString()
  pinterest?: string;

  @ApiPropertyOptional({
    description: 'Telegram URL',
    example: 'https://t.me/mybusiness',
  })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Medium URL',
    example: 'https://medium.com/@mybusiness',
  })
  @IsOptional()
  @IsUrl()
  medium?: string;
}

class CreateLinkDto {
  @ApiProperty({
    description: 'Link URL',
    example: 'https://example.com/link1',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'Link text', example: 'Link 1' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreateBusinessDto {
  @ApiProperty({ description: 'Name of the business', example: 'My Business' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Logo URL of the business',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Email address of the business',
    example: 'business@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the business',
    example: '123-456-7890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Website URL of the business',
    example: 'https://example.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ description: 'Address of the business' })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty()
  address: CreateAddressDto;

  @ApiProperty({ description: 'Social media links of the business' })
  @ValidateNested()
  @Type(() => CreateSocialDto)
  @IsNotEmpty()
  socials: CreateSocialDto;

  @ApiPropertyOptional({
    description: 'Links related to the business',
    type: [CreateLinkDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  @IsOptional()
  links?: CreateLinkDto[];
}
