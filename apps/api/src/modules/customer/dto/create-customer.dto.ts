import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Email address of the customer', example: 'customer@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'First name of the customer', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the customer', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Confirm Password', example: 'password123' })
  @IsString()
  password2: string;

  @ApiProperty({ description: 'Campaign ID', example: 'campaign-uuid-1234' })
  @IsString()
  campaignId: string;
}
