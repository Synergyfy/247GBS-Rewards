import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../core/enums/roles.js';
import { SignupSource } from '../../../core/enums/signupSource.js';
import { PaginationQueryDto } from './pagination-query.dto.js';
import {
  BusinessAddressDto,
  BusinessLinkDto,
  BusinessSocialsDto,
} from './business-query.dto.js';

export const toBoolean = ({ value }: { value: unknown }) => {
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  return value;
};

export class AdminListQueryDto extends PaginationQueryDto {}

export class UserListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Role, description: 'Filter by role' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    enum: SignupSource,
    description: 'Filter by signup source',
  })
  @IsEnum(SignupSource)
  @IsOptional()
  signupSource?: SignupSource;

  @ApiPropertyOptional({ description: 'Filter by account status' })
  @Transform(toBoolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Only users created on or after this date',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  createdFrom?: string;

  @ApiPropertyOptional({
    description: 'Only users created on or before this date',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  createdTo?: string;
}

export class UpdateUserAdminDto {
  @ApiPropertyOptional({ example: 'Maya Chen' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'maya.chen@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1 512 555 1000' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Austin', nullable: true })
  @IsString()
  @IsOptional()
  location?: string | null;

  @ApiPropertyOptional({ enum: Role, example: Role.ADMIN })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class SetUserStatusDto {
  @ApiProperty({ example: false, description: 'Desired account status' })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'Account suspended after support review',
    description: 'Reason recorded in the audit log',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'Customer requested a password reset via support',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  reason: string;
}

export class DeleteReasonDto {
  @ApiProperty({
    example: 'Duplicate test account',
    description: 'Reason recorded in the audit log',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  reason: string;
}

export class IdParamDto {
  @ApiProperty({
    description: 'Resource UUID',
    example: 'cbc5bf3f-b608-4b87-b4d0-ee457aac9573',
  })
  @IsUUID()
  id: string;
}

export class UserIdParamDto {
  @ApiProperty({
    description: 'Owner user UUID',
    example: 'cbc5bf3f-b608-4b87-b4d0-ee457aac9573',
  })
  @IsUUID()
  userId: string;
}

export class CreateBusinessForUserDto {
  @ApiProperty({ example: 'Northstar Coffee' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'hello@northstar.example' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1 512 555 2000' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'https://northstar.example' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example/logo.png' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ type: () => BusinessAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessAddressDto)
  address?: BusinessAddressDto;

  @ApiPropertyOptional({ type: () => BusinessSocialsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessSocialsDto)
  socials?: BusinessSocialsDto;

  @ApiPropertyOptional({ type: () => [BusinessLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessLinkDto)
  links?: BusinessLinkDto[];
}

export class UpdateBusinessAdminDto {
  @ApiPropertyOptional({ example: 'Northstar Coffee' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'hello@northstar.example' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1 512 555 2000' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://northstar.example', nullable: true })
  @IsString()
  @IsOptional()
  website?: string | null;

  @ApiPropertyOptional({ example: 'https://cdn.example/logo.png', nullable: true })
  @IsString()
  @IsOptional()
  logo?: string | null;

  @ApiPropertyOptional({ type: () => BusinessAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessAddressDto)
  address?: BusinessAddressDto;

  @ApiPropertyOptional({ type: () => BusinessSocialsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessSocialsDto)
  socials?: BusinessSocialsDto;

  @ApiPropertyOptional({ type: () => [BusinessLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessLinkDto)
  links?: BusinessLinkDto[];
}

export class UpdateStaffAdminDto {
  @ApiPropertyOptional({ example: 'Sam Staff' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'sam.staff@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'https://cdn.example/avatar.png', nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string | null;
}
