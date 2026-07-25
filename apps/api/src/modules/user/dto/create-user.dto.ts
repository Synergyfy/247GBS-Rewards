import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SignupSource } from '../../../core/enums/signupSource';
import { Role } from '../../../core/enums/roles';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    enum: Role,
    example: Role.CUSTOMER,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Password of the user',
    example: 'mypassword',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'Confirm Password of the user',
    example: 'mypassword',
  })
  @IsString()
  @IsOptional()
  password2?: string;

  @ApiPropertyOptional({
    description: 'Location of the user',
    example: 'New York, USA',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Referral code for the user',
    example: 'REF12345',
  })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({
    description: 'Signup source of the user',
    example: SignupSource.MCOM,
    enum: SignupSource,
  })
  @IsEnum(SignupSource)
  @IsOptional()
  signupSource?: SignupSource;
}
