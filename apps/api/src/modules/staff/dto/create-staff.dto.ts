import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: 'ID of the business the staff belongs to',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID()
  businessId: string;

  @ApiProperty({
    description: 'Name of the staff member',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the staff member',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the staff member',
    example: 'password123',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Avatar URL of the staff member',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Indicates if the staff member is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
}
