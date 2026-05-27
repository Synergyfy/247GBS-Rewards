import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  password: string;
}

export class CreateCustomerAuthDto {
  @ApiProperty({
    description: 'The email address of the customer',
    example: 'customer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the customer',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The unique identifier of the campaign',
    example: 'campaign-uuid-1234',
  })
  @IsString()
  @IsNotEmpty()
  campaignId: string;
}
export class SSOLoginDto {
  @ApiProperty({
    description: 'The Single Sign-On ID',
    example: 'sso-uuid-1234',
  })
  @IsString()
  @IsNotEmpty()
  ssoId: string;
}
